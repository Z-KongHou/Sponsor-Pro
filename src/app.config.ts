export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/register/index',
    'pages/register/enterprise',
    'pages/register/teacher',
    'pages/register/club',
    'pages/sponsor/schoolSponsor',
    'pages/sponsor/enterpriseSponsor',
    'pages/user/user',
    'pages/sponsor/detailsponsor',
  ],

  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
