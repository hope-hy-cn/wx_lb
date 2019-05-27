module.exports ={
  "nested": {
    "pb": {
      "nested": {
        "PushMessageSend": {
          "fields": {
            "broadcastCategory": {
              "type": "int32",
              "id": 1
            },
            "receivers": {
              "rule": "repeated",
              "type": "string",
              "id": 2
            },
            "content": {
              "type": "string",
              "id": 3
            },
            "sign": {
              "type": "string",
              "id": 4
            },
            "sendTime": {
              "type": "string",
              "id": 5
            },
            "appKey": {
              "type": "string",
              "id": 6
            }
          }
        }
      }
    }
  }
}