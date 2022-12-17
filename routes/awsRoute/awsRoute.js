const fileUploadMiddleware = require('../../middlwares/uploadFile')
const {
	saveAndUploadFile,
	getUploadedFile,
	updateFile,
	deleteFile
} = require('../../service/aws/awsFileService')
const {
	uploadFileSchema,
	createFolderSchema,
	updateFileSchema
} = require('./awsValidator')
const validate = require(`${__base}utils/validate`)
const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)
const {
	createAWSFolder,
	getAllFoldersWithFile,
	getFolderWithFile,
	deleteFolder
} = require('../../database/repo/aws/awsFolderRepo')
const {
	getsearchFile
} = require('../../database/repo/aws/awsFileRepo')

// File upload folder
const UPLOADS_FOLDER = 'awsS3Storage'
// define the storage
const upload = fileUploadMiddleware(UPLOADS_FOLDER)
const awsRoute = (app) => {
	//Get all airlines
	app.post(
		'/api/files',
		auth,
		upload.array('files'),
		validate(uploadFileSchema),
		async (req, res) => {
			try {
				if (req.files?.length == 0) {
					return res.status(400).json({
						statusCode: '400',
						status: 'Request schema error',
						error: 'minimum one file is required'
					})
				}

				let requestObj = req.body
				const result = await saveAndUploadFile(req.files, requestObj)

				return res.status(result.statusCode).send(result)
			} catch (err) {
				logger.error('Error in aws upload api ', err)
				return res.status(500).send(err.message)
			}
		}
	)

	app.get('/api/files/file/:fileId', auth, async (req, res) => {
		try {
			let fileId = req.params.fileId
			const response = await getUploadedFile(fileId)
			return res.status(response.statusCode).send(response)
		} catch (err) {
			logger.error('Error in get file => ', err)
			return res.status(500).send(err.message)
		}
	})

	app.get('/api/files/search', auth, async (req, res) => {
		try {
			const response = await getsearchFile(req.query)
			return res.status(response.statusCode).send(response)
		} catch (err) {
			logger.error('Error in get file => ', err)
			return res.status(500).send(err.message)
		}
	})


	app.patch(
		'/api/files/file/:fileId',
		auth,
		upload.single('file'),
		validate(updateFileSchema),
		async (req, res) => {
			try {
				if (req.file) {
					let fileId = req.params.fileId
					let requestObj = req.body
					const result = await updateFile(fileId, [req.file], requestObj)

					return res.status(result.statusCode).send(result)
				} else {
					return res.status(400).json({
						statusCode: '400',
						status: 'Request schema error',
						error: 'file is required'
					})
				}
			} catch (err) {
				logger.error('Error in update file => ', err)
				return res.status(500).send(err.message)
			}
		}
	)

	app.delete('/api/files/file/:fileId', auth, async (req, res) => {
		try {
			let fileId = req.params.fileId
			console.log(fileId)
			const result = await deleteFile(fileId)

			return res.status(result.statusCode).send(result)
		} catch (err) {
			logger.error('Error in update file => ', err)
			return res.status(500).send(err.message)
		}
	})

	// create Folder
	app.post(
		'/api/folders',
		auth,
		validate(createFolderSchema),
		async (req, res) => {
			try {
				let data = req.body
				const response = await createAWSFolder(data)
				return res.status(response.statusCode).send(response)
			} catch (err) {
				logger.error('Error in post AWS folder create => ', err)
				return res.status(500).send(err.message)
			}
		}
	)

	app.get('/api/folders/:folderId', auth, async (req, res) => {
		try {
			let folderId = req.params.folderId
			const response = await getFolderWithFile(folderId)
			return res.status(response.statusCode).send(response)
		} catch (err) {
			logger.error('Error in update folder => ', err)
			return res.status(500).send(err.message)
		}
	})

	app.get('/api/folders', auth, async (req, res) => {
		try {
			const response = await getAllFoldersWithFile()
			return res.status(response.statusCode).send(response)
		} catch (err) {
			logger.error('Error in get all folders => ', err)
			return res.status(500).send(err.message)
		}
	})

	app.delete('/api/folders/:folderId', auth, async (req, res) => {
		try {
			let folderId = req.params.folderId
			const response = await deleteFolder(folderId)
			return res.status(response.statusCode).send(response)
		} catch (err) {
			logger.error('Error in update folder => ', err)
			return res.status(500).send(err.message)
		}
	})
}

module.exports = awsRoute
