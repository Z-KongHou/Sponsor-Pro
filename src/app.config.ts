export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/register/index',
    'pages/register/enterprise',
    'pages/register/teacher',
    'pages/register/club',
    'pages/sponsor/sponsor',
    'pages/sponsor/detailSponsor',
    'pages/sponsor/publish',
    'pages/user/user',
    'pages/user/editProfile',
    'pages/chat/chat',
    'pages/chat/privateChat',
    'pages/chat/receiverProfile',
    'pages/sponsor/publish'
  ],

  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
