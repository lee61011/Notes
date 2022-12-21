/**
 * 初始化空目录
 *  空目录下新增 .gitkeep 文件
 */

const fs = require('fs')
const path = require('path')
const excludeDir = ['.git']

const gitkeep = '.gitkeep'

function initDir(target) {
  const files = fs.readdirSync(target)
  files.forEach(item => {
    if (excludeDir.includes(item)) return

    const child = target + '/' + item
    if (fs.statSync(child).isDirectory()) {
      const childFiles = fs.readdirSync(child)
      if (childFiles.length === 0) {
        fs.writeFile(`${child}/.gitkeep`, gitkeep, function(err) {
          if (err) return console.log(err)
        })
      } else {
        initDir(child)
      }
    }
  })
}

initDir(path.dirname('Notes'))
