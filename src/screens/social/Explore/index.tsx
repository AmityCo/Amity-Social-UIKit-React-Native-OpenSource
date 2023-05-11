import * as React from 'react';
import { ReactElement, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import { View, Text, TouchableOpacity, Animated, ScrollView, Image } from 'react-native';
import { styles } from './styles';
import useAuth from '../../../../lib/typescript/src/hooks/useAuth';

export default function Explore() {
  const { isConnected } = useAuth();
  
  return (
      <View style={styles.container}>
          <Text style={styles.title}>Recommended for you</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {users.map((user) => (
                  <View style={styles.card} key={user.id}>
                      <Image
                          style={styles.avatar}
                          source={{
                              uri: `https://api.amity.co/api/v3/files/${groupChat?.avatarFileId}/download`,
                          }}
                      />
                      <Text style={styles.name}>{user.name}</Text>
                      <Text style={styles.bio}>{user.bio}</Text>
                  </View>
              ))}
          </ScrollView>
      </View>
  );
}
