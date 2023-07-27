import { CategoryRepository, UserRepository } from '@amityco/ts-sdk';
import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { styles } from './styles';
import { closeIcon } from '../../svg/svg-xml-list';
interface IModal {
  visible: boolean;
  userId?: string;
  onClose: () => void;
  onSelect: (userIds: string[]) => void;
}
const AddMembersModal = ({ visible, onClose, onSelect }: IModal) => {

  const handleOnClose = () => {
    onClose && onClose()

  }

  return (
    <Modal visible={visible} animationType="slide">
       <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleOnClose}>
            <SvgXml xml={closeIcon} width="17" height="17" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Select Member</Text>
          </View>
          <TouchableOpacity>
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
        </View>
    </Modal>
  );
};

export default AddMembersModal;

