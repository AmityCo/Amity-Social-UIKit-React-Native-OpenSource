import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { leaveAmityChannel } from '../../providers/channel-provider';
import { styles } from './styles';

interface ChatDetailProps {
    navigation: any;
    route: any;
}

export const ChatRoomSetting: React.FC<ChatDetailProps> = ({ navigation, route }) => {
    const {channelId} = route.params;
    const handleGroupProfilePress = () => {
        navigation.navigate('EditChatDetail', { navigation, channelID: channelId });
    };

    const handleMembersPress = () => {
        navigation.navigate('MemberDetail', { navigation, channelID: channelId });
    };

    const handleLeaveChatPress = () => {
        leaveAmityChannel("add something here")
    };

    const renderItem = ({ item }: any) => {
        switch (item.id) {
            case 1:
                return (
                    <TouchableOpacity style={styles.rowContainer} onPress={handleGroupProfilePress}>
                        <View style={styles.iconContainer}>
                            <Image source={require('../../../assets/icon/editPencil.png')} style={styles.icon} />
                        </View>
                        <Text style={styles.rowText}>Group profile</Text>
                        <Image source={require('../../../assets/icon/arrowRight.png')} style={styles.arrowIcon} />
                    </TouchableOpacity>
                );
            case 2:
                return (
                    <TouchableOpacity style={styles.rowContainer} onPress={handleMembersPress}>
                        <View style={styles.iconContainer}>
                            <Image source={require('../../../assets/icon/groupMember.png')} style={styles.groupIcon} />
                        </View>
                        <Text style={styles.rowText}>Members</Text>
                        <Image source={require('../../../assets/icon/arrowRight.png')} style={styles.arrowIcon} />
                    </TouchableOpacity>
                );
            case 3:
                return (
                    <TouchableOpacity style={styles.rowContainer} onPress={handleLeaveChatPress}>
                        <View style={styles.leaveChatContainer}>
                            <Text style={styles.leaveChatLabel}>Leave Chat</Text>
                        </View>
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };

    const data = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};