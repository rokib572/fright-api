const { generateUUID } = require('../../../service/authService')
const { successResponse, errorResponse } = require('../../../helpers')
const logger = require('../../../utils/logger')
const folder = require('../../models/folder')
const { checkUserID } = require('../../repo/staff/userRepo')
const { getAllFiles } = require('./awsFileRepo')

const createAWSFolder = async (folderInfo) => {
	try {
		let isName = await checkFolderName(folderInfo.name)
		if (isName) {
			return errorResponse('Folder name already exists.', 404)
		}
		let isUser = await checkUserID(folderInfo.createdBy)
		if (isUser) {
			await folder.save(folderInfo)

			return successResponse('Folder created successfully')
		}
		return errorResponse('User not found')
	} catch (err) {
		logger.error('error on folder create-> ', err)
		return errorResponse('Failed to create folder', 500)
	}
}

const checkFolderName = async (name) => {
	try {
		const isName = await folder.get({
			where: {
				name: name
			}
		})
		if (isName.length === 0) {
			return false
		}
		return true
	} catch (e) {
		logger.error(
			'error on folders repo checkFolderName response--->',
			e.message
		)
		return false
	}
}

const getFolderInfo = async (id) => {
	try {
		const data = await folder.get({
			where: {
				id: id
			}
		})
		if (data.length > 0) {
			return data[0]
		}
		return null
	} catch (e) {
		logger.error('failed to get folder -> ', err)
		return null
	}
}

const getFolderWithFile = async (folderId) => {
	try {
		let [dbFoldersData, filesData] = await Promise.all([
			folder.get(),
			getAllFiles()
		])

		let folders = dbFoldersData.filter(
			(folderItem) => folderItem.id == folderId
		)
		if (folders.length > 0) {
			let folderObj = folders[0]
			folderObj.childFolders = getStructuredData(
				dbFoldersData,
				folderObj.id,
				filesData
			)
			folderObj.files = getFolderFiles(filesData, folderObj.id)

			return successResponse(folderObj)
		}
		return errorResponse('Folder not found', 404)
	} catch (error) {
		logger.error(
			'failed to get folder data getFolderWithFile function -> ',
			error
		)
		return errorResponse('Failed to get folder', 500)
	}
}

const getAllFoldersWithFile = async () => {
	try {
		let [dbFoldersData, filesData] = await Promise.all([
			folder.get(),
			getAllFiles()
		])

		let result = getStructuredData(dbFoldersData, null, filesData)

		return successResponse(result)
	} catch (error) {
		logger.error(
			'failed to get folders getAllFoldersWithFile function -> ',
			error
		)
		return errorResponse('Failed to get folders', 500)
	}
}

const getStructuredData = (originalData, parentId, filesData) => {
	let data = []
	originalData
		.filter((folderItem) => folderItem.parentFolderId == parentId)
		.map((parentFolder) => {
			let folder = { ...parentFolder }
			folder.childFolders = getStructuredData(
				originalData,
				parentFolder.id,
				filesData
			)
			folder.files = getFolderFiles(filesData, parentFolder.id)
			data.push(folder)
		})
	return data
}

const getFolderFiles = (files, folderId) => {
	return files.filter((file) => file.folderId == folderId)
}

const deleteFolder = async (folderId) => {
	try {
		let folders = await folder.get({
			where: {
				id: folderId
			}
		})

		if (folders.length > 0) {
			let childFolders = await folder.get({
				where: {
					parentFolderId: folderId
				}
			})
			if (childFolders.length > 0) {
				return errorResponse(
					'Folder is not empty! It contains sub folders or files',
					400
				)
			}

			let files = await getAllFiles({
				where: {
					folderId: folderId
				}
			})

			if (files.length > 0) {
				return errorResponse(
					'Folder is not empty! It contains sub folders or files',
					400
				)
			}

			await folder.delete({
				where: {
					id: folderId
				}
			})
			return successResponse('Folder deleted successfully')
		}

		return errorResponse('Folder not found', 404)
	} catch (error) {
		logger.error('failed to get folders deleteFolder function -> ', error)
		return errorResponse('Failed to delete folder', 500)
	}
}

const getAllDbFolders = async (where) => {
	try {
		let folders = folder.get(
			where
				? {
						where: where
				  }
				: {}
		)

		return folders
	} catch (error) {
		logger.error('Error in get getAllDbFolders function -> ', error)
		return []
	}
}

module.exports = {
	createAWSFolder,
	getFolderInfo,
	getFolderWithFile,
	getAllFoldersWithFile,
	deleteFolder,
	getAllDbFolders
}
