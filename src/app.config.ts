export default defineAppConfig({
  pages: [
    'pages/index/index', 
    'pages/register/index',
    'pages/register/enterprise',
    'pages/register/teacher',
    'pages/register/club'
  ],

  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
});