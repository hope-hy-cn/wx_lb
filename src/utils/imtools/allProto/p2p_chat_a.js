module.exports = {
  "nested": {
    "pb": {
      "nested": {
        "P2pChatA": {
          "fields": {
            "P2POfflineMsg": {
              "rule": "repeated",
              "type": "MessageSingle",
              "id": 1
            }
          }
        },
        "MessageSingle": {
          "fields": {
            "content": {
              "type": "string",
              "id": 1
            },
            "sendtime": {
              "type": "string",
              "id": 2
            },
            "msgid": {
              "type": "string",
              "id": 3
            },
            "msgCategory": {
              "type": "int32",
              "id": 4
            },
            "sender": {
              "type": "string",
              "id": 5
            }
          }
        }
      }
    }
  }
}