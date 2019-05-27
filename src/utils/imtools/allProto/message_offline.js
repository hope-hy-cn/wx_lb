module.exports = {
  "nested": {
    "pb": {
      "nested": {
        "MessageOfflines": {
          "fields": {
            "AllOfflineMsg": {
              "rule": "repeated",
              "type": "MessageOffline",
              "id": 1
            }
          }
        },
        "MessageOffline": {
          "fields": {
            "AccId": {
              "type": "string",
              "id": 1
            },
            "NickName": {
              "type": "string",
              "id": 2
            },
            "Avatar": {
              "type": "string",
              "id": 3
            },
            "Total": {
              "type": "int32",
              "id": 4
            },
            "Content": {
              "type": "string",
              "id": 5
            },
            "SendTime": {
              "type": "string",
              "id": 6
            },
            "MsgCategory": {
              "type": "int32",
              "id": 7
            },
            "isSender": {
              "type": "bool",
              "id": 8
            },
            "isOnline": {
              "type": "bool",
              "id": 9
            }
          }
        }
      }
    }
  }
}