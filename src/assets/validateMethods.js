function checkSpecialKey (str) {
  let specialKey =
    '[`~!#$^&*()=|{}\':;\'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“\'。，、？]‘\''
  for (let i = 0; i < str.length; i++) {
    if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
      return false
    }
  }
  return true
}

export {
  checkSpecialKey
}
