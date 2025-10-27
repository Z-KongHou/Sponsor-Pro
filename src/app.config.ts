export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/register/index',
    'pages/register/enterprise',
    'pages/register/teacher',
    'pages/register/club',
    'pages/sponsor/sponsor',
    'pages/sponsor/detailSponsor',
    'pages/user/user',
    'pages/sponsor/publish',
    'pages/user/editProfile'
  ],

  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
