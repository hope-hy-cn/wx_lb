module.exports = {
  "nested": {
    "pb": {
      "nested": {
        "Message": {
          "fields": {
            "category": {
              "type": "int32",
              "id": 1
            },
            "messages": {
              "rule": "repeated",
              "type": "MessageDeliver",
              "id": 2
            }
          }
        },
        "MessageDeliver": {
          "fields": {
            "messageId": {
              "type": "string",
              "id": 1
            },
            "hash": {
              "type": "string",
              "id": 2
            },
            "sender": {
              "type": "string",
              "id": 3
            },
            "senderDeviceId": {
              "type": "string",
              "id": 4
            },
            "receiver": {
              "type": "string",
              "id": 5
            },
            "chatCategory": {
              "type": "int32",
              "id": 6
            },
            "msgCategory": {
              "type": "int32",
              "id": 7
            },
            "read": {
              "type": "int32",
              "id": 8
            },
            "content": {
              "type": "string",
              "id": 9
            },
            "sendTime": {
              "type": "string",
              "id": 10
            }
          }
        }
      }
    }
  }
}