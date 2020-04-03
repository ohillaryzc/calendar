// 生成日历构造方法
/*
* @params dom(日历放置位置的ＤＯＭ) fn(点击日期的回调方法) start(开始星期，默认星期天0)
**/
function Calendar ({dom, fn, start, title, shield}) {
  this.dom = dom
  this.clickLi = fn || function () {}
  this.start = start || 0
  this.title = title
  this.shield = shield
  let nowDate = new Date()
  this.nowYear = nowDate.getFullYear() // 获取年份
  // var nowWeek = nowDate.getDay() // 获取星期，0-6代表星期天到星期一*
  this.nowDay = nowDate.getDate() // 获取今天几号
  this.nowMonth = nowDate.getMonth() + 1 // 获取当前月份，计算一号为星期几

  // 创建头部显示时间文字,第二行星期，第三部分主体部分
  this.$time = document.createElement('div')
  this.$time.className = 'calendar-title'
  this.$week = document.createElement('ul')
  this.$week.className = 'calendar-header'
  this.$date = document.createElement('div')
  this.$date.className = 'calendar'

  this.$lis = []

  // 创建星期头部(定制)
  let week = ['日', '一', '二', '三', '四', '五', '六'] // 默认
  let del = week.splice(0, start)
  for (let i = 0; i < del.length; i++) {
    week.push(del[i])
  }
  this.week = week
  this.dom.appendChild(this.$time)
  this.setHeaderTime()
  this.setHeaderWeek()
}

// 设置头部（日期显示，星期行）
Calendar.prototype.setHeaderTime = function () {
  // 头部显示时间
  if (this.title) {
    this.$time.innerText = this.nowYear + '年' + this.nowMonth + '月'
  } else {
    this.$time.innerText = ''
  }
}

Calendar.prototype.setHeaderWeek = function () {
  // 星期列表
  for (let i = 0; i < this.week.length; i++) {
    this.$week.innerHTML += '<li>' + this.week[i] + '</li>'
  }

  this.dom.appendChild(this.$week)
}

Calendar.prototype.getNowDate = function () {
  return {year: this.nowYear, month: this.nowMonth, day: this.nowDay}
}

// 核心方法
Calendar.prototype.createCalendar = function (fn) {
  // 日期计算
  let firstDayStr = '' + this.nowYear + '/' + this.nowMonth + '/1'
  let firstDayWeek = new Date(firstDayStr).getDay()

  let empty = firstDayWeek - this.start // 计算有多少天是上个月的，即可确定日期摆放位置
  if (empty < 0) {
    empty += 7
  }

  // 填充上个月
  let perMonth = this.nowMonth - 1

  let perSize = 0
  if (perMonth < 1) {
    perSize = this.monthSize(this.nowYear - 1, 12)
  } else {
    perSize = this.monthSize(this.nowYear, perMonth)
  }
  let date = [] // 存放当前日期数组
  for (let i = perSize; i > perSize - empty; i--) {
    date.unshift({day: i, mark: 1})
  }

  // 填充本月
  let size = this.monthSize(this.nowYear, this.nowMonth)
  for (let i = 1; i <= size; i++) {
    date.push({day: i, mark: 0})
  }

  // 填充下一个月 7*6 = 42
  let nextSize = 42 - date.length
  for (let i = 1; i <= nextSize; i++) {
    date.push({day: i, mark: 2})
  }

  // 日期数据处理
  let row = 0 // 记录当前第几行
  this.$date.innerHTML = ''
  let $uls = [document.createElement('ul')]
  date.forEach((item, index) => {
    if (index >= 7 && index % 7 === 0) {
      row++
      $uls.push(document.createElement('ul'))
      // $uls[row].innerHTML = ''
    }
    let html = document.createElement('li')
    html.innerHTML = '<span>' + item.day + '</span>'
    if (item.mark) {
      html.className = 'other'
    } else {
      if (item.day === this.nowDay) {
        html.className = 'active'
      }
      if (fn) {
        fn(item, html)
      }
    }
    $uls[row].appendChild(html)
    // $lis.push(html)
    let _self = this
    html.onclick = function () {
      _self.setDate(item, index)
      _self.clickLi({year: _self.nowYear, month: _self.nowMonth, day: item.day})
    }
  })
  $uls.forEach(item => {
    this.$date.appendChild(item)
  })

  this.dom.appendChild(this.$date)
  this.setHeaderTime()
}

// 获取当前月份多少天
Calendar.prototype.monthSize = function (year, month) {
  let YEAR = year
  let MONTH = month
  if (!year) {
    YEAR = this.nowYear
  }
  if (!month) {
    MONTH = this.nowMonth
  }
  let size = 31
  if ((MONTH % 2 === 0 && MONTH <= 7) || (MONTH % 2 !== 0 && MONTH >= 8)) {
    size = 30
  }
  if (MONTH === 2) {
    if ((YEAR % 4 === 0 && YEAR % 100 !== 0) || (YEAR % 400 === 0)) {
      // 闰年
      size = 29
    } else {
      size = 28
    }
  }
  return size
}

// 判断日期是否为本月最后一天
Calendar.prototype.isLast = function () {
  let maxSize = this.monthSize()
  return this.nowDay === maxSize
}

// 点击日期
Calendar.prototype.setDate = function (item, index) {
  if (!this.$lis[0]) {
    // 第一次点击，获取所有的li
    this.$lis = this.$date.getElementsByTagName('li')
  }
  this.nowDay = item.day
  let li = this.$date.getElementsByClassName('active')[0]
  if (li.className.indexOf('other') !== -1) {
    li.className = 'other'
  } else {
    li.className = ''
  }
  this.$lis[index].className = this.$lis[index].className +' active'
  if (item.mark === 1 && !this.shield) {
    if (this.nowMonth === 1) {
      this.nowYear--
      this.nowMonth = 12
    } else {
      this.nowMonth--
    }
    this.createCalendar()
  } else if (item.mark === 2 && !this.shield) {
    if (this.nowMonth === 12) {
      this.nowYear++
      this.nowMonth = 1
    } else {
      this.nowMonth++
    }
    this.createCalendar()
  }
  this.setHeaderTime()
}

// 点击上一月
Calendar.prototype.previous = function () {
  this.nowMonth--
  if (this.nowMonth < 1) {
    this.nowYear--
    this.nowMonth = 12
  }
  this.createCalendar()
  this.setHeaderTime()
}

// 点击下一月
Calendar.prototype.next = function () {
  this.nowMonth++
  if (this.nowMonth > 12) {
    this.nowYear++
    this.nowMonth = 1
  }
  this.createCalendar()
  this.setHeaderTime()
}
