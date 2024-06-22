import React, { useState, useLayoutEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useStyles } from './styles';
import type { UserInterface } from '../../types/user.interface';
import AddMembersModal from '../../components/AddMembersModal';
import { updateCommunityMember } from '../../providers/Social/communities-sdk';
import MemberActionModal from './Components/MemberActionModal';
import CustomTab from '../../components/CustomTabV3';
import { TabName } from '../../enum/tabNameState';
import CommunityMembersTab from './Components/CommunityMembersTab';
import { PlusIcon } from '../../svg/PlusIcon';

export default function CommunityMemberDetail({ navigation, route }: any) {
  const styles = useStyles();
  const [member, setMember] = useState<UserInterface[]>([]);
  const { communityId, isModerator } = route.params;
  const [addMembersModal, setAddMembersModal] = React.useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [activeTab, setActiveTab] = useState(TabName.Members);

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setAddMembersModal(true);
          }}
        >
          <PlusIcon style={styles.plusIcon}/>
        </TouchableOpacity>
      ),
    });
  }, [navigation, styles.dotIcon]);

  const onSelectMember = async (users: UserInterface[]) => {
    const memberIds = users.map((user) => user.userId);
    try {
      await updateCommunityMember({ operation: 'ADD', communityId, memberIds });
      // getMembers();
    } catch (error) {
      console.log(error);
    }
  };

  const onThreeDotTap = (user: UserInterface) => {
    setUserId(user.userId);
    setActionModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <CustomTab
        tabName={[TabName.Members, TabName.Moderators]}
        onTabChange={setActiveTab}
      />

      <CommunityMembersTab
        activeTab={activeTab}
        communityId={communityId}
        onThreeDotTap={onThreeDotTap}
        setMember={setMember}
      />
      <AddMembersModal
        onSelect={onSelectMember}
        onClose={() => setAddMembersModal(false)}
        visible={addMembersModal}
        initUserList={[]}
        excludeUserList={member}
      />
      <MemberActionModal
        isVisible={actionModalVisible}
        setIsVisible={setActionModalVisible}
        userId={userId}
        communityId={communityId}
        hasModeratorPermission={isModerator}
        isInModeratorTab={activeTab === TabName.Moderators}
      />
    </View>
  );
}
