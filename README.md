# 原生js日历插件

做项目遇到定制的日历，第三方组件提供的日历大多不能修改样式，这里用原生js实现一个可自定义样式的日历组件

## 使用
- 构造函数Calendar(option)
    - option: {dom, [fn], [start], [title], [shield]}
        - dom: 放日历的box
        - fn: 点击回调函数，返回当前点击的日期
        - start: 自定义顶部星期几开始，默认星期日0，星期一-星期六（1-6）
        - title: 是否显示头部当前年月，可通过getNowDate获取当前日期
        - shield: 是否屏蔽点击非本月切换
- 方法
    - createCalendar 生成日历结构
    - getNowDate 获取当前月份
    - previous 切换到上一个月
    - next 切换到下一个月
    
样式可完全自定义（根据类名修改）；切换月份按钮可自定义；可屏蔽点击非本月日期自动切换；
