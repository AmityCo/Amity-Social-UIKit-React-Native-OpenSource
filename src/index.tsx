
import React from 'react';
import AmityUiKitProvider from './providers/amity-ui-kit-provider';
import AmityUiKitSocial from './routes/SocialNavigator';


const exploreScreen = () => {
    return <AmityUiKitSocial screen='Explore' />
}
const MyCommunityScreen = () => {
    return <AmityUiKitSocial screen='MyCommunity' />
}
const NewsfeedScreen = () => {
    return <AmityUiKitSocial screen='Newsfeed' />
}

const UserProfile = () => {
    return <AmityUiKitSocial screen='UserProfile' />
}
const PreloadCommunityHome = () => {
    return  <AmityUiKitSocial screen='PreloadCommunityHome' />
}
const MyUserProfile = () => {
    return  <AmityUiKitSocial screen='MyUserProfile' />
}



export {
    AmityUiKitProvider,
    AmityUiKitSocial,
    exploreScreen as ExplorePage,
    MyCommunityScreen as MyCommunityPage,
    NewsfeedScreen as Newsfeed,
    UserProfile,
    PreloadCommunityHome as CommunityHome,
    MyUserProfile

};
