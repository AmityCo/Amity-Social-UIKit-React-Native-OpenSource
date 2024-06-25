
import React from 'react';
import AmityUiKitProvider from './providers/amity-ui-kit-provider';
import AmityUiKitSocial from './routes/SocialNavigator';
import useAuth from './hooks/useAuth';

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
const CommunityHome = () => {
    const { isConnected } = useAuth()
    return isConnected && <AmityUiKitSocial screen='CommunityHome' />
}


export {
    AmityUiKitProvider,
    AmityUiKitSocial,
    exploreScreen as ExplorePage,
    MyCommunityScreen as MyCommunityPage,
    NewsfeedScreen as Newsfeed,
    UserProfile,
    CommunityHome

};
