import React, { useCallback, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { circleCloseIcon, plusIcon } from '../../svg/svg-xml-list';
import { useStyles } from './styles';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import ModalSelector from 'react-native-modal-selector';
import Header from './Components/Header';
import { PollRepository, PostRepository } from '@amityco/ts-sdk-react-native';
import { checkCommunityPermission } from '../../providers/Social/communities-sdk';
import useAuth from '../../hooks/useAuth';
import AmityMentionInput from '../../components/MentionInput/AmityMentionInput';
import { TSearchItem } from '../../hooks/useSearch';
import { text_contain_blocked_word } from '../../util/constants';
import { SafeAreaView } from 'react-native-safe-area-context';


const CreatePoll = ({ navigation, route }) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const { apiRegion, client } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isMultipleOption, setIsMultipleOption] = useState(false);
  const [pollOptions, setPollOptions] = useState<
    Pick<Amity.PollAnswer, 'data' | 'dataType'>[]
  >([]);
  const [optionQuestion, setOptionQuestion] = useState('');
  const [mentionUsers, setMentionUsers] = useState<TSearchItem[]>([]);
  const [mentionPosition, setMentionPosition] = useState([]);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  const [timeFrame, setTimeFrame] = useState<{ key: number; label: string }>(
    null
  );
  const {
    targetId,
    targetType,
    targetName,
    postSetting,
    needApprovalOnPostCreation,
    isPublic,
  } = route.params;
  const privateCommunityId =
    targetType === 'community' && !isPublic && targetId;
  const MAX_POLL_QUESRION_LENGTH = 500;
  const MAX_POLL_ANSWER_LENGTH = 200;
  const MAX_OPTIONS = 10;
  const MIN_OPTIONS = 2;
  const MAX_SCHEDULE_DAYS = 30;
  const MILLISECONDS_IN_DAY = 86400000;
  const closedIn = MILLISECONDS_IN_DAY * parseInt(timeFrame?.label, 10) || null;
  const answerType = isMultipleOption ? 'multiple' : 'single';
  const data: { key: number; section?: boolean; label: string }[] = [
    {
      key: 0,
      section: true,
      label: 'Choose time frame',
    },
  ];
  for (let index = 0; index < MAX_SCHEDULE_DAYS; index++) {
    data[index + 1] = { key: index + 1, label: `${index + 1} days` };
  }

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCreatePost = useCallback(async () => {
    setLoading(true);
    const {
      data: { pollId },
    } = await PollRepository.createPoll({
      question: optionQuestion,
      answerType: answerType,
      answers: pollOptions,
      closedIn: closedIn,
    });
    if (!pollId) return;
    const mentionees = [
      {
        type: 'user',
        userIds: mentionUsers.map((user) => user.id),
      },
    ];
    try {
      const response = await PostRepository.createPost({
        dataType: 'poll',
        targetType,
        targetId,
        data: { pollId, text: optionQuestion },
        mentionees,
        metadata: { mentioned: mentionPosition },
      });
      setLoading(false);
      if (targetType !== 'community') return goBack();
      if (
        !response ||
        postSetting !== 'ADMIN_REVIEW_POST_REQUIRED' ||
        !needApprovalOnPostCreation
      )
        return goBack();
      const res = await checkCommunityPermission(
        targetId,
        client as Amity.Client,
        apiRegion
      );
      if (
        res.permissions.length > 0 &&
        res.permissions.includes('Post/ManagePosts')
      )
        return goBack();
      Alert.alert(
        'Post submitted',
        'Your post has been submitted to the pending list. It will be reviewed by community moderator',
        [
          {
            text: 'OK',
            onPress: () => goBack(),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      if (error.message.includes(text_contain_blocked_word)) {
        Alert.alert('', text_contain_blocked_word);
      }
    }
  }, [
    answerType,
    apiRegion,
    client,
    closedIn,
    goBack,
    mentionPosition,
    mentionUsers,
    needApprovalOnPostCreation,
    optionQuestion,
    pollOptions,
    postSetting,
    targetId,
    targetType,
  ]);

  const onPressAddOption = useCallback(() => {
    if (pollOptions.length < 10) {
      setPollOptions((prev) => [...prev, { data: '', dataType: 'text' }]);
    }
  }, [pollOptions]);

  const onPressRemoveOption = useCallback(
    (index: number) => {
      const currentOptions = [...pollOptions].filter((_, i) => i !== index);
      setPollOptions(currentOptions);
    },
    [pollOptions]
  );

  const onChangeOptionText = useCallback((text: string, index: number) => {
    setPollOptions((prev) => {
      return prev.map((item, i) => {
        if (i === index) return { data: text, dataType: 'text' };
        return item;
      });
    });
  }, []);

  const isBtnDisable =
    optionQuestion.length === 0 ||
    pollOptions.length < 2 ||
    pollOptions[0].data.length === 0 ||
    pollOptions[1].data.length === 0;

  return (
    <SafeAreaView style={styles.AllInputWrap}>
      <Header
        targetName={targetName}
        goBack={goBack}
        isBtnDisable={isBtnDisable}
        handleCreatePost={handleCreatePost}
      />
      <ScrollView
        scrollEnabled={isScrollEnabled}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {loading && (
          <ActivityIndicator animating={loading} color={'black'} size="large" />
        )}
        <View style={styles.inputContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.inputTitle}>
              Poll question
              <Text style={styles.requiredField}>*</Text>
            </Text>
            <Text style={styles.maxPollQuestionText}>
              {`${optionQuestion.length}/${MAX_POLL_QUESRION_LENGTH}`}
            </Text>
          </View>
          <View style={styles.mentionInputContainer}>
            <AmityMentionInput
              privateCommunityId={privateCommunityId}
              isBottomMentionSuggestionsRender={true}
              onFocus={() => {
                setIsScrollEnabled(false);
              }}
              onBlur={() => {
                setIsScrollEnabled(true);
              }}
              placeholder="What's your poll question?"
              placeholderTextColor={theme.colors.baseShade3}
              setInputMessage={setOptionQuestion}
              mentionUsers={mentionUsers}
              setMentionUsers={setMentionUsers}
              mentionsPosition={mentionPosition}
              setMentionsPosition={setMentionPosition}
              maxLength={MAX_POLL_QUESRION_LENGTH}
              multiline
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.inputTitle}>
              Options
              <Text style={styles.requiredField}>*</Text>
            </Text>
            <Text
              style={styles.maxPollQuestionText}
            >{`${pollOptions.length}/${MAX_OPTIONS}`}</Text>
          </View>
          <Text style={styles.subtitle}>
            Choose at least {MIN_OPTIONS} options
          </Text>
          {pollOptions.map((pollOption, index) => {
            const onReachMaxChar =
              pollOption.data.length === MAX_POLL_ANSWER_LENGTH;
            const errorContinerStyle: ViewStyle = onReachMaxChar && {
              borderWidth: 1,
              borderColor: 'red',
            };
            return (
              <>
                <View
                  key={index}
                  style={[styles.pollOptionContainer, errorContinerStyle]}
                >
                  <View style={styles.rowContainer}>
                    <TextInput
                      maxLength={MAX_POLL_ANSWER_LENGTH}
                      value={pollOptions[index].data}
                      multiline
                      placeholder="Add option"
                      placeholderTextColor={theme.colors.baseShade3}
                      style={styles.optionInput}
                      onChangeText={(text) => onChangeOptionText(text, index)}
                    />
                    <SvgXml
                      xml={circleCloseIcon}
                      width="20"
                      height="20"
                      onPress={() => onPressRemoveOption(index)}
                    />
                  </View>
                </View>
                {onReachMaxChar && (
                  <Text style={styles.errorText}>
                    You have reached 200 character limit
                  </Text>
                )}
              </>
            );
          })}
          {pollOptions.length < 10 && (
            <TouchableOpacity
              style={styles.addOptionBtn}
              onPress={onPressAddOption}
            >
              <SvgXml
                xml={plusIcon(theme.colors.base)}
                width="20"
                height="20"
              />
              <Text style={styles.addOptionText}>Add option</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.rowContainer}>
            <View style={styles.fillSpace}>
              <Text style={styles.inputTitle}>Multiple selection</Text>
              <Text style={styles.subtitle}>
                Turn on to allow others to vote more than one option
              </Text>
            </View>
            <Switch
              value={isMultipleOption}
              onValueChange={setIsMultipleOption}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Schedule poll (Optional)</Text>
          <Text style={styles.subtitle}>
            Poll will be automatically closed at the end of chosen time frame
            (UTC)
          </Text>
          <ModalSelector
            data={data}
            selectTextStyle={styles.selectedTimeFrame}
            selectedKey={timeFrame?.key || null}
            onModalClose={setTimeFrame}
            initValue="Choose time frame"
            selectStyle={styles.scheduleSelectorSelectStyle}
            optionContainerStyle={styles.scheduleOptionContainer}
            optionTextStyle={styles.scheduleOptionText}
            sectionTextStyle={styles.scheduleTitleStyle}
            sectionStyle={styles.scheduleSectionStyle}
            optionStyle={styles.scheduleOptionStyle}
            initValueTextStyle={styles.scheduleInitValueTextStyle}
            selectedItemTextStyle={styles.scheduleSelectedItemText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePoll;
