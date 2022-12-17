const { s3UploadV2, s3GetFileUrl, s3FileDelete } = require('./awsFileConfig')

const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)
const {
	getFolderInfo,
	getAllDbFolders
} = require('../../database/repo/aws/awsFolderRepo')
const {
	saveFile,
	getFile,
	updateDbFile,
	deleteDbFile
} = require('../../database/repo/aws/awsFileRepo')
const { checkUserID } = require('../../database/repo/staff/userRepo')

const saveAndUploadFile = async (files, requestObj) => {
	try {
		let isUser = await checkUserID(requestObj.createdBy)
		if (isUser) {
			let folderName = null
			if (requestObj?.folderId) {
				let folder = await getFolderInfo(requestObj?.folderId)
				if (folder == null) {
					return errorResponse('Folder not found')
				}

				let folders = await getAllDbFolders()
				folderName = getFolderNames(folders, folder)
			}

			//console.log('uploaded file ->>>>', files)
			let response = await s3UploadV2(files, folderName)
			//console.log('aws response ->>>>', response)

			let resp = await Promise.all(
				response?.map((fileItem, index) => {
					let file = files[index]

					let fileObj = {
						name: file.originalname,
						mimeType: file.mimetype,
						awsFileKey: fileItem.key,
						awsFileEntityTag: fileItem.ETag,
						folderId: requestObj?.folderId,
						createdBy: requestObj?.createdBy
					}

					return saveFile(fileObj)
				})
			)

			//console.log('resp->>>>>', resp)
			let totalFile = files.length
			let successCount = 0
			resp.map((res) => {
				if (res.statusCode == 200) successCount++
			})

			if (totalFile == successCount) {
				return successResponse('File uploaded successfully')
			} else if (successCount) {
				return successResponse(`${successCount} file saved successfully`)
			} else {
				return errorResponse('Failed to save files')
			}
		}
		return errorResponse('User not found')
	} catch (error) {
		logger.error('Error on save and upload file Function err=>', error)
		return errorResponse('Something went wrong in server', 500)
	}
}

const updateFile = async (fileId, files, requestObj) => {
	try {
		let isUser = await checkUserID(requestObj.modifiedBy)
		if (isUser) {
			const file = await getFile(fileId)
			if (file != null) {
				const folder = await getFolderInfo(file.folderId)
				let folders = await getAllDbFolders()
				const folderName = getFolderNames(folders, folder)
				let response = await s3UploadV2(files, folderName)

				if (response.length > 0) {
					let updateFileObj = { ...file }
					delete updateFileObj.createdDate
					delete updateFileObj.modifiedDate
					let fileObj = files[0]
					let res = response[0]

					updateFileObj.modifiedBy = requestObj.modifiedBy
					updateFileObj.name = fileObj.originalname
					updateFileObj.mimeType = fileObj.mimetype
					updateFileObj.awsFileKey = res.key
					updateFileObj.awsFileEntityTag = res.ETag
					let resp = await updateDbFile(updateFileObj, fileId)

					if (resp.statusCode == 200) {
						await s3FileDelete(file.awsFileKey)
						return successResponse('File updated successfully')
					} else {
						await s3FileDelete(res.key)
						return errorResponse('Failed to update file')
					}
				} else {
					return errorResponse('Failed to update file')
				}
			}
			return errorResponse('File not found')
		}
		return errorResponse('User not found')
	} catch (error) {
		logger.error('Error on updateFile Function err=>', error)
		return errorResponse('Something went wrong in server', 500)
	}
}

const getUploadedFile = async (fileId) => {
	try {
		const file = await getFile(fileId)
		if (file != null) {
			let s3FileUrl = await s3GetFileUrl(file.awsFileKey)
			return successResponse(s3FileUrl)
		}
		return errorResponse('File not found')
	} catch (error) {
		logger.error('Error on getUploadedFile Function err=>', error)
		return errorResponse('Something went wrong in server', 500)
	}
}

const deleteFile = async (fileId) => {
	try {
		const file = await getFile(fileId)
		if (file != null) {
			let resp = await deleteDbFile(fileId)

			if (resp.statusCode == 200) {
				await s3FileDelete(file.awsFileKey)
				return successResponse('File deleted successfully')
			} else {
				return errorResponse('Failed to delete file')
			}
		}
		return errorResponse('File not found')
	} catch (error) {
		logger.error('Error on deleteUploadedFile Function err=>', error)
		return errorResponse('Something went wrong in server', 500)
	}
}

const getFolderNames = (folders, folder) => {
	if (folder == null) return ''

	let folderName = folder.name
	let parentFolder = folders.find((fold) => fold.id == folder.parentFolderId)
	let parentFolderName = getFolderNames(folders, parentFolder)

	return parentFolderName ? parentFolderName + '/' + folderName : folderName
}

module.exports = {
	saveAndUploadFile,
	updateFile,
	getUploadedFile,
	deleteFile
}
