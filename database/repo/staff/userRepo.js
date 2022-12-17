const bcrypt = require('bcryptjs')
const authService = require(`${__base}service/authService`)
const { v4: uuidv4 } = require('uuid')
const logger = require(`${__base}/utils/logger`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const sendEmail = require(`${__base}service/mailService`)
const DateTime = require('../../../utils/DateTime')
const usersStaff = require('../../models/usersStaff')
const usersStaffTokens = require('../../models/usersStaffTokens')
const usersStaffForgotPassword = require('../../models/usersStaffForgotPassword')
const usersStaffContactCards = require('../../models/usersStaffContactCards')
const customQuery = require('../../models/customQuery')
const saveUser = async (data, createdBy) => {
    try {
        const { firstName, lastName, email, password } = data

        const user = await getUserByEmail(email)

        if (!user) {
            var userObj = {}

            //Create userObject
            userObj['firstName'] = firstName
            userObj['lastName'] = lastName
            userObj['email'] = email

            let userId = await authService.generateUUID()
            let theSalt = await bcrypt.genSalt(10)
            let encPassword = await bcrypt.hash(password, theSalt)

            userObj['id'] = userId
            userObj['password'] = encPassword

            await usersStaff.save(userObj)
            let userContactId = await authService.generateUUID()
            const userContactObj = {
                id: userContactId,
                usersStaffId: userId,
                displayName: firstName + ' ' + lastName,
                email: email,
                createdBy: createdBy,
                modifiedBy: createdBy,
                modifiedDate: DateTime.getCurrentTime(),
            }
            await usersStaffContactCards.save(userContactObj)
            delete userObj.password
            return successResponse(userObj)
        } else {
            return errorResponse('User already exists!', 400)
        }
    } catch (e) {
        logger.error('DB Error in saveUser_function, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

const verifyLogin = async (email, password) => {
    try {
        const result = await usersStaff.get({
            where: {
                email: email,
            },
        })
        if (result.length > 0) {
            let encPassword = result[0].password
            let passwordMatch = bcrypt.compareSync(password, encPassword)

            if (!passwordMatch) {
                return errorResponse('Invalid Password')
            }

            let userTokenInfo = {
                firstName: result[0].firstName,
                lastName: result[0].lastName,
                userId: result[0].id,
                email: result[0].email,
            }

            await deleteUserStaffToken(userTokenInfo.userId)
            // deleteForgetPasswordToken(userTokenInfo.userId)

            const jwtToken = await authService.generateToken(userTokenInfo)

            const dataObj = {
                usersStaffId: userTokenInfo.userId,
                token: jwtToken,
                expiresAt: DateTime.getTimeWithInterval(10),
            }

            await usersStaffTokens.save(dataObj)

            return {
                statusCode: 200,
                message: 'Login Successful',
                token: jwtToken,
            }
        } else {
            return errorResponse('Incorrect Username or Password!')
        }
    } catch (e) {
        logger.error('Error in verifyLogin_function: error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

const deleteUserStaffToken = async (userId) => {
    try {
        await usersStaffTokens.delete({
            where: {
                usersStaffId: userId,
            },
        })
    } catch (e) {
        logger.error('Error in deleteUserStaffToken_function: error ->>', e)
        return errorResponse(e.message, 500)
    }
}

//check user staff token exist by userId
const checkUserStaffToken = async (userId) => {
    try {
        const timeNow = DateTime.getCurrentTime()

        const result = await usersStaffTokens.get({
            where: {
                usersStaffId: userId,
            },
            cwhere: `expiresAt > '${timeNow}'`,
        })
        if (result.length > 0) {
            return true
        } else {
            return false
        }
    } catch (e) {
        logger.error('Error in checkUserStaffToken_function: error ->>', e)
        throw e
    }
}

const getUserByEmail = async (email) => {
    try {
        const result = await usersStaff.get({
            where: {
                email: email,
            },
        })
        if (result.length > 0) {
            return result
        } else {
            return false
        }
    } catch (e) {
        logger.error('Error in getUserByEmail_function, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

const getUsers = async (page) => {
    try {
        let users
        if (page) {
            users = await usersStaff.get({
                where: {
                    isDeleted: 0,
                },
                columns: ['id', 'firstName', 'lastName', 'email'],
                page: page,
                limit: 10,
                orderBy: 'lastName ASC',
            })
        } else {
            users = await usersStaff.get({
                where: {
                    isDeleted: 0,
                },
                columns: ['id', 'firstName', 'lastName', 'email'],
                orderBy: 'lastName ASC',
            })
        }
        if (users.length > 0) {
            const response = {
                statusCode: 200,
                status: 'success',
            }
            response.page = page ? page : 1
            response.limit = page
                ? `${page == 1 ? 1 : page * 10 - 9}-${
                      page == 1 ? users.length : page * 10 - 10 + users.length
                  }`
                : `1-${users.length}`
            response.result = users
            return response
        }
        return errorResponse('No users found!', 404)
    } catch (e) {
        logger.error('Error in getUsers_function, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

//get single user staff by id
const getUserStaffById = async (id) => {
    try {
        const result = await usersStaff.get({
            columns: [
                'id',
                'firstName',
                'lastName',
                'email',
                'createdDate',
                'timeZone',
            ],
            where: {
                id: id,
                isDeleted: 0,
            },
        })
        if (result.length > 0) {
            return successResponse(result[0])
        } else {
            return errorResponse('No Staff Users Found')
        }
    } catch (e) {
        logger.error('Error in getUserStaffById_function, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

const updateUser = async (id, userObj) => {
    try {
        userObj['modifiedDate'] = DateTime.getCurrentTime()
        delete userObj.timeZone
        delete userObj.createdDate
        delete userObj.password
        delete userObj.id
        delete userObj.isDeleted
        const result = await usersStaff.update(userObj, {
            where: {
                id: id,
                isDeleted: 0,
            },
        })
        if (result) {
            return successResponse('User updated successfully')
        } else {
            return errorResponse('User not found')
        }
    } catch (e) {
        logger.error('Error in updateUser_function, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

// delete user staff by id
const deleteUser = async (id) => {
    try {
        const result = await usersStaff.update(
            {
                isDeleted: 1,
            },
            {
                where: {
                    id: id,
                    isDeleted: 0,
                },
            }
        )
        if (result) {
            return successResponse('User deleted successfully')
        } else {
            return errorResponse('User not found')
        }
    } catch (e) {
        logger.error('Error in deleteUser_function, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

const checkForgetPasswordTokenExists = async (usersStaffId) => {
    try {
        const expiresAt = DateTime.getCurrentTime()

        const result = await usersStaffForgotPassword.get({
            where: {
                usersStaffId: usersStaffId,
            },
            cwhere: `expiresAt > '${expiresAt}'`,
        })

        if (result.length > 0) {
            return result[0].forgotPasswordToken
        } else {
            return false
        }
    } catch (e) {
        logger.error(
            'Error in checkForgetPasswordTokenExists function: error ->>',
            e
        )
        throw e
    }
}

const createForgetpasswordToken = async (usersStaffId) => {
    try {
        const token = uuidv4()

        const expiresAt = DateTime.getTimeWithInterval(3)

        await usersStaffForgotPassword.save({
            usersStaffId: usersStaffId,
            forgotPasswordToken: token,
            expiresAt: expiresAt,
        })

        return token
    } catch (e) {
        logger.error(
            'Error in createForgetpasswordToken function: error ->>',
            e
        )
        throw e
    }
}

const forgotPasswordToken = async (email) => {
    try {
        const user = await getUserByEmail(email)

        if (!user) {
            return errorResponse("This email doesn't exist")
        }

        let token = await checkForgetPasswordTokenExists(user[0].id)

        if (!token) {
            token = await createForgetpasswordToken(user[0].id)
        }
        deleteUserStaffToken(user[0].id)
        const mailBody = `To reset your password, please click the link ${process.env.WEBSITE_BASE_URL}/api/staff/forgotPassword/token/${token}`
        const mailResult = await sendEmail(
            email,
            'Reset Password token',
            mailBody
        )
        return successResponse(mailResult)
    } catch (e) {
        logger.error('Error in forgotPasswordToken function, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

//check a forgetPasswordToekn is valid or not
const checkForgetPasswordTokenValid = async (forgotPasswordToken) => {
    try {
        const result = await usersStaffForgotPassword.get({
            where: {
                forgotPasswordToken: forgotPasswordToken,
            },
            cwhere: `expiresAt > '${DateTime.getCurrentTime()}'`,
        })

        if (result.length > 0) {
            return result[0]
        } else {
            return false
        }
    } catch (e) {
        logger.error(
            'Error in checkForgetPasswordTokenValid function, error ->>',
            e
        )
        return errorResponse('Something went wrong in server', 500)
    }
}

const deleteForgetPasswordToken = async (usersStaffId) => {
    try {
        await usersStaffForgotPassword.delete({
            where: {
                usersStaffId: usersStaffId,
            },
        })
    } catch (e) {
        logger.error(
            'Error in deleteForgetPasswordToken function, error ->>',
            e
        )
        return errorResponse('Something went wrong in server', 500)
    }
}

//reset password
const resetPassword = async (token, password) => {
    let theSalt = await bcrypt.genSalt(10)
    let encPassword = await bcrypt.hash(password, theSalt)

    try {
        const result = await checkForgetPasswordTokenValid(token)

        if (!result) {
            return errorResponse('Invalid token', 400)
        }

        deleteForgetPasswordToken(result.usersStaffId)
        deleteUserStaffToken(result.usersStaffId)

        await usersStaff.update(
            {
                password: encPassword,
            },
            {
                where: {
                    id: result.usersStaffId,
                },
            }
        )
        return successResponse('Password reset successfully')
    } catch (e) {
        logger.error('Error in resetPassword function, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

const getUserContactCard = async (id) => {
    try {
        const sql = `SELECT usersStaffContactCards.displayName, usersStaffContactCards.email, usersStaffContactCards.profilePhoto, usersStaffContactCards.directPhone, usersStaffContactCards.mobilePhone, usersStaffContactCards.officePhone FROM usersStaffContactCards INNER JOIN usersStaff ON usersStaffContactCards.usersStaffId = usersStaff.id WHERE usersStaffContactCards.usersStaffId = '${id}' AND usersStaff.isDeleted = 0`
        const result = await customQuery.query(sql)

        if (result.length > 0) {
            if (result[0].officePhone && result[0].officePhone.length > 6) {
                let officePhone = ''
                let oldOfficePhone = result[0].officePhone.replace(/-/g, '')
                oldOfficePhone = oldOfficePhone.replace(/\s/g, '')
                if (
                    oldOfficePhone.includes('(') ||
                    oldOfficePhone.includes(')')
                ) {
                    oldOfficePhone = oldOfficePhone.replace(/[()]/g, '')
                }
                for (let i = 0; i < oldOfficePhone.length; i++) {
                    if (i == 0) {
                        officePhone += '(' + oldOfficePhone[i]
                    } else if (i == 3) {
                        officePhone += ') ' + oldOfficePhone[i]
                    } else if (i == 6) {
                        officePhone += '-' + oldOfficePhone[i]
                    } else {
                        officePhone += oldOfficePhone[i]
                    }
                }
                result[0].officePhone = officePhone
            }

            return successResponse(result[0])
        } else {
            return errorResponse('No Contact Card Found')
        }
    } catch (e) {
        logger.error('Error in getUserContactCard function, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

const updateUserContactCard = async (id, data) => {
    try {
        const user = await usersStaff.get({
            where: {
                id: id,
                isDeleted: 0,
            },
        })

        if (user.length === 0) {
            return errorResponse(
                'The userId you are trying to update does not exist'
            )
        }
        const checkEmail = await usersStaff.get({
            cwhere: `email = '${data.email}' and id != '${id}'`,
        })
        if (checkEmail.length > 0) {
            return errorResponse('Email already used by another user')
        }
        const userContactObj = {
            displayName: data.displayName,
            directPhone: data.directPhone,
            mobilePhone: data.mobilePhone,
            officePhone: data.officePhone,
            email: data.email,
            profilePhoto: data.profilePhoto,
            modifiedBy: data.modifiedBy,
            modifiedDate: DateTime.getCurrentTime(),
        }

        for (let key in userContactObj) {
            if (
                userContactObj[key] === undefined ||
                userContactObj[key] === null
            ) {
                delete userContactObj[key]
            }
        }

        const result = await usersStaffContactCards.update(userContactObj, {
            where: {
                usersStaffId: id,
            },
        })
        if (result) {
            return successResponse('Contact Card updated successfully')
        } else {
            return errorResponse('Contact Card not found')
        }
    } catch (e) {
        logger.error('Error in updateUserContactCard function, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

const checkUserID = async (Id) => {
    try {
        const isID = await usersStaff.get({
            where: {
                id: Id,
                isDeleted: 0,
            },
        })
        if (isID.length === 0) {
            return false
        }
        return true
    } catch (e) {
        logger.error('error on user repo checkUserID response--->', e.message)
    }
}

module.exports = {
    saveUser,
    verifyLogin,
    forgotPasswordToken,
    checkForgetPasswordTokenValid,
    resetPassword,
    checkUserStaffToken,
    updateUser,
    deleteUser,
    getUserStaffById,
    getUsers,
    getUserContactCard,
    updateUserContactCard,
    checkUserID
}
