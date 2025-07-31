interface User {
    open_id:string,
    name:string,
    email:string,
    phone:string,
    role:"teacher"|"club"|"enterprise",
}
interface teacher extends User{
    subject:string,
    department:string,
    school:string,
}
interface clubmember extends User{
    category:string,
    clubName:string,
    school:string,
    description:string
}
interface enterprise extends User{
    companyName:string,
    industry:string,
    description:string,
}
export {teacher,clubmember,enterprise}