# progress进度事件

## Node server

```javascript
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser');
const express = require('express')
const app = express()

app.use(bodyParser());

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
})

app.get('/api/download/file/:fileName', function(req, res, next) {
  const fileName = req.params.fileName
  const filePath = path.join(__dirname, '/public/static', fileName)
  const stats = fs.statSync(filePath)
  console.log(fileName, filePath, stats)
  if (stats.isFile()) {
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename='+fileName,
      'Content-Length': stats.size
    })
    fs.createReadStream(filePath).pipe(res)
  } else {
    res.end(404)
  }
})

app.post('/api/download/file', function(req, res, next) {
  console.log('req -------- ', req.body)
  const { fileName } = req.body
  const filePath = path.join(__dirname, 'public/static', fileName)
  const stats = fs.statSync(filePath)
  console.log(fileName, filePath, stats)
  if (stats.isFile()) {
    res.set({
      // 'Content-Type': 'appliaction/octet-stream',
      // 'Content-Disposition': 'attachment; filename='+fileName,
      'Content-Length': stats.size
    })
    fs.createReadStream(filePath).pipe(res)
  } else {
    res.end(404)
  }
})

app.listen(3001, function() {
  console.log('app is running at port 3001')
})

```



## client

```vue
<template>
  <div class="button-container">
    <button @click="getDownload">GET 下载</button>
    <button @click="postDownload">POST下载</button>
    <button @click="xhrDownload">原生XHR下载</button>
  </div>
</template>

<script setup>
import axios from 'axios'

const getDownload = () => {
  axios.get('/api/download/file/width.mp4', {
    responseType: 'arraybuffer',
    onDownloadProgress: (progress) => {
      console.log('get download progress -------- ', progress)
    }
  }).then(res => {
    console.log('res -------- ', res)
  })
}

const postDownload = () => {
  axios.post('/api/download/file', { fileName: 'width.mp4' }, {
    responseType: 'arraybuffer',
    onDownloadProgress: progress => {
      const { progress: percent } = progress
      console.log('post download progress --------- ', Number(percent * 100).toFixed(2))
    }
  }).then(res => {
    console.log('res -------- ', res)
  })
}


function createXHR() {
  if (typeof XMLHttpRequest !== 'undefined') {
    return new XMLHttpRequest()
  } else if (typeof ActiveXObject !== 'undefined') {
    if (typeof arguments.callee.activeXString !== 'string') {
      let versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'], i, len
      for (i = 0, len = versions.length; i < len; i++) {
        try {
          new ActiveXObject(versions[i])
          arguments.callee.activeXString = versions[i]
          break
        } catch (ex) {
          // 跳过
        }
      }
    }
    return new ActiveXObject(arguments.callee.activeXString)
  } else {
    throw new Error('No XHR object available.')
  }
}
const xhrDownload = () => {
  // xhrDownload
  console.log('xhrDownload ------- ')
  const xhr = createXHR()
  xhr.responseType = 'arraybuffer' // 同步请求设置responseType会报错 (xhr.open false)   open的第三个参数表示是否异步发送请求
  xhr.onload = event => {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      // alert(xhr.responseText)
      console.log('xhr.responseText ', xhr.responseType, xhr.response)
    } else {
      alert('Request was unsuccessful: ' + xhr.status)
    }
  }
  xhr.onprogress = event => {
    if (event.lengthComputable) {
      const { loaded, total } = event
      console.log('progress ---------- ', event, loaded, total, Number(loaded / total).toFixed(2))
    }
  }
  // xhr.open('get', '/api/download/file/width.mp4', false)
  // xhr.send(null)
  xhr.open('post', '/api/download/file', true) // false 表示同步发送请求 监听不到进度
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(JSON.stringify({ fileName: 'width.mp4' }))
}

</script>
```

