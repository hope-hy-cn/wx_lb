module.exports ={
  "nested": {
    "pb": {
      "nested": {
        "PushMessage": {
          "fields": {
            "messages": {
              "rule": "repeated",
              "type": "MessagePush",
              "id": 2
            }
          }
        },
        "MessagePush": {
          "fields": {
            "broadcastCategory": {
              "type": "int32",
              "id": 1
            },
            "receiver": {
              "type": "string",
              "id": 2
            },
            "content": {
              "type": "string",
              "id": 3
            },
            "sendTime": {
              "type": "string",
              "id": 4
            }
          }
        }
      }
    }
  }
}