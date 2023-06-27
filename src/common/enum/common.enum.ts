export enum Sex {
    Unknown = 0,
    Man = 1,
    Woman = 2
}

export enum Message {
    AccountExist = "The account already exists. Log in or change the account name immediately",
    NicknameExist = "The nickname already exists. Log in or change the account name immediately",
    RoleNameExist = "The rolename already exists.",
    RoleKeyExist = "The rolekey already exists.",    
    AuthNameExist = "The authname already exists.",
    AuthKeyExist = "The authkey already exists.",
    PageTitleExist = "The page title already exists.",
    PagePathRequired = "The page path is required.",
    PageComponentPathRequired = "The page component path is required.",
    ServerError = "An unexpected error has occurred. Please try again later",
    RequiredIdOfUpdateTarget = "Please pass the valid id of the user whose information you want to update",
}

export enum StatusCode {
    Yes = "0",
    No = "1",
}

export enum PageType {
    Page = "P", // 页面
    Button = "B", // 按钮
}

export enum PostType {
    Transshipment = "R",
    Original = "O",
    Translate = "T"
}

export enum PostVisibleRange {
    Public = "P",
    Owner = "O",
    Login = "L"
}

export enum ImageType {
    Avatar = "avatar",
    Photo = "photo",
    Illustration = "illustration"
}

export enum FriendStatusCode {
    Rejected = "R",
    Fulfilled = "F",
    Pending = "P"
}

export enum SourceType {
    Post = "P",
    Talk = "T",
    Friend = "F"
}