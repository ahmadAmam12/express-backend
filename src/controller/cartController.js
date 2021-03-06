// const { qs } = require('querystring')
const joi = require('joi')
const responseStandar = require('../helpers/response')
const {
  createCartModel,
  getCartUserModel,
  getCartDelModel,
  deleteItemModel,
  getPriceModel
} = require('../models/cartModel')
const responseStandart = require('../helpers/response')

module.exports = {
  createCart: async (req, res) => {
    const { id } = req.user
    const schema = joi.object({
      itemsId: joi.string().required(),
      amount: joi.string().required()
    })
    const { value: result, error } = schema.validate(req.body)
    if (error) {
      return responseStandar(res, 'Error', { error: error.message }, 400, false)
    } else {
      const { itemsId, amount } = result
      const cart = {
        user_id: id,
        items_id: itemsId,
        amount: amount
      }
      const addToCart = await createCartModel([cart])
      if (addToCart.affectedRows) {
        return responseStandar(res, 'added to cart', { result })
      } else {
        return responseStandart(res, 'cannot add to cart', {}, 401, false)
      }
    }
  },
  getCartUser: async (req, res) => {
    const { id } = req.user
    const results = await getCartUserModel(id)
    const priceAll = await getPriceModel(id)
    const dataPrice = priceAll.map(i => i.price)
    const sumPrice = dataPrice.reduce(function (a, b) {
      return a + b
    }, 0)
    if (results.length) {
      const data = results.map(data => {
        const dataValue = {
          ...data
        }
        return dataValue
      })
      responseStandar(res, `cart for user id ${id}`, { data, sumPrice })
    } else {
      responseStandar(res, `User with id ${id} haven't put the item on cart`, {}, 404, false)
    }
  },
  deleteItem: (req, res) => {
    const { id } = req.params
    getCartDelModel(id, result => {
      if (result.length) {
        deleteItemModel(id, result => {
          if (result.affectedRows) {
            res.send({
              succcess: true,
              message: `id ${id} deleted!`
            })
          } else {
            res.send({
              succes: false,
              message: 'cannot delete data!!'
            })
          }
        })
      } else {
        res.send({
          success: false,
          message: 'no data founded'
        })
      }
    })
  }
}
