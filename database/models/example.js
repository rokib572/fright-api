const usersLocation = require('./usersLocation')
const customQuery = require('./customQuery')
const logger = require(`${__base}/utils/logger`)

const saveLocation = async (data) => {
  try {
    await usersLocation.save(data)
  } catch (err) {
    logger.error(err)
  }
}

const getAllLocation = async () => {
  try {
    const locations = await usersLocation.get()
    return locations
  } catch (err) {
    logger.error(err)
  }
}

const getLocationWithCondition = async (data) => {
  try {
    const locations = await usersLocation.get({
      // if you wish, you can select columns you want to return else it will return all columns
      // columns: ['id', 'first_name', 'last_name'],
      where: {
        companyAddress1: 'My address22',
        companyCity: 'My city222',
      },
      //cwhere: `expiresAt > '${new Date()}' AND expiresAt < '${new Date()}'`,
      // you can also select page and limit
      // page: 1,
      // limit: 10,
    })
    return locations
  } catch (err) {
    logger.error(err)
  }
}

const updateLocation = async (data) => {
  try {
    const locations = await usersLocation.update(data, {
      where: {
        companyAddress1: 'My address22',
        companyCity: 'My city222',
      },
    })
    return locations
  } catch (err) {
    logger.error(err)
  }
}

const deleteLocation = async () => {
  try {
    const locations = await usersLocation.delete({
      where: {
        companyAddress1: 'My address22',
      },
    })
    return locations
  } catch (err) {
    logger.error(err)
  }
}

const customQueryTest = async () => {
  try {
    const data = await customQuery.query('SELECT * FROM locations')
    logger.error(data)
  } catch (err) {
    logger.error(err)
  }
}

module.exports = {
  saveLocation,
  getAllLocation,
  getLocationWithCondition,
  updateLocation,
  deleteLocation,
  customQueryTest,
}
