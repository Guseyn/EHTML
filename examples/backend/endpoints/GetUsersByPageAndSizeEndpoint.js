'use strict'

const { Endpoint } = require('@cuties/rest')
const { RequestParam, EndedResponse, WrittenResponse, ResponseWithHeader, ResponseWithStatusMessage, ResponseWithStatusCode } = require('@cuties/http')
const { StringifiedJSON } = require('@cuties/json')
const Users = require('./../objects/Users')
const User = require('./../objects/User')
const UsersByPageAndSize = require('./../objects/UsersByPageAndSize')

const listOfUsers = new Users(
  new User(1),
  new User(2),
  new User(3),
  new User(4),
  new User(5),
  new User(6),
  new User(7),
  new User(8),
  new User(9),
  new User(10),
  new User(11),
  new User(12),
  new User(13),
  new User(14),
  new User(15),
  new User(16),
  new User(17),
  new User(18),
  new User(19),
  new User(20),

  new User(21),
  new User(22),
  new User(23),
  new User(24),
  new User(25),
  new User(26),
  new User(27),
  new User(28),
  new User(29),
  new User(30),
  new User(31),
  new User(32),
  new User(33),
  new User(34),
  new User(35),
  new User(36),
  new User(37),
  new User(38),
  new User(39),
  new User(40),

  new User(41),
  new User(42),
  new User(43),
  new User(44),
  new User(45),
  new User(46),
  new User(47),
  new User(48),
  new User(49),
  new User(50),
  new User(51),
  new User(52),
  new User(53),
  new User(54),
  new User(55),
  new User(56),
  new User(57),
  new User(58),
  new User(59),
  new User(60)
)

class GetUsersEndpoint extends Endpoint {
  constructor (regexp, type) {
    super(regexp, type)
  }

  body (request, response) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 200), 'ok'
          ),
          'Content-Type', 'application/json'
        ),
        new StringifiedJSON(
          new UsersByPageAndSize(
            listOfUsers,
            new RequestParam(
              request,
              'page'
            ),
            new RequestParam(
              request,
              'size'
            )
          )
        )
      )
    )
  }
}

module.exports = GetUsersEndpoint
