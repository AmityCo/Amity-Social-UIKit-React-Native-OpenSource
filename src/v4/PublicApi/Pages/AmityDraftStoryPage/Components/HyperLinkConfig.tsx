import React, { FC, memo, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modalbox';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
import { useStyles } from '../styles';
import useConfig from '../../../../hook/useConfig';
import { ComponentID, ElementID, PageID } from '../../../../enum';
import { checkURLValidation } from '../../../../../util/urlUtil';
import useAuth from '../../../../../hooks/useAuth';
import { SvgXml } from 'react-native-svg';
import { storyDraftDeletHyperLink } from '../../../../../svg/svg-xml-list';

interface IHyperLinkConfig {
  isVisibleModal: boolean;
  hyperlinkItem?: { url: string; customText: string };
  setIsVisibleModal: (arg: boolean) => void;
  onHyperLinkSubmit: (arg?: { url: string; customText: string }) => void;
}

const HyperlinkConfig: FC<IHyperLinkConfig> = ({
  isVisibleModal,
  onHyperLinkSubmit,
  setIsVisibleModal,
  hyperlinkItem,
}) => {
  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;
  const { getUiKitConfig } = useConfig();
  const [url, setUrl] = useState(hyperlinkItem?.url ?? '');
  const { client } = useAuth();
  const [customizedText, setCustomizedText] = useState(
    hyperlinkItem?.customText ?? ''
  );
  const [loading, setLoading] = useState(false);
  const [urlErrorMessage, setUrlErrorMessage] = useState(null);
  const [customTextErrorMessage, setCustomTextErrorMessage] = useState(null);
  const invalidURLText = 'Please enter a valid URL.';
  const blockedURLText = 'Please enter a whitelisted URL.';
  const blockedCustomText = 'Your text contains a blocklisted word.';

  const configDoneText =
    (
      getUiKitConfig({
        page: PageID.StoryPage,
        component: ComponentID.HyperLinkConfig,
        element: ElementID.DoneBtn,
      }) as Record<string, string>
    )?.done_button_text ?? 'Done';

  const reset = useCallback(() => {
    setUrl('');
    setCustomizedText('');
  }, []);

  const onClosed = useCallback(() => {
    setIsVisibleModal(false);
  }, [setIsVisibleModal]);

  const handleUrl = useCallback((text: string) => {
    setUrlErrorMessage(null);
    setUrl(text);
    const isValid = checkURLValidation(text);
    !isValid && setUrlErrorMessage(invalidURLText);
  }, []);

  const handleCustomText = useCallback((text: string) => {
    setCustomTextErrorMessage(null);
    setCustomizedText(text);
  }, []);

  const validateHyperlinkUrl = useCallback(async () => {
    if (url.length > 0) {
      const validatedUrl = await (client as Amity.Client)
        .validateUrls([url])
        .catch(() => false);
      !validatedUrl && setUrlErrorMessage(blockedURLText);
      return validatedUrl;
    }
    return false;
  }, [client, url]);

  const validateHyperlinkText = useCallback(async () => {
    if (customizedText.length > 0) {
      const validatedCustomText = await (client as Amity.Client)
        .validateTexts([customizedText])
        .catch(() => false);
      !validatedCustomText && setCustomTextErrorMessage(blockedCustomText);
      return validatedCustomText;
    }
    return true;
  }, [client, customizedText]);

  const validateHyperlink = useCallback(async () => {
    const validUrl = await validateHyperlinkUrl();
    const validText = await validateHyperlinkText();
    validUrl &&
      validText &&
      onHyperLinkSubmit({ url, customText: customizedText });
  }, [
    customizedText,
    onHyperLinkSubmit,
    url,
    validateHyperlinkText,
    validateHyperlinkUrl,
  ]);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    await validateHyperlink();
    setLoading(false);
  }, [validateHyperlink]);

  const onDeleteHyperlink = useCallback(() => {
    reset();
    onHyperLinkSubmit();
  }, [onHyperLinkSubmit, reset]);

  const onPressDeleteHyperlink = useCallback(() => {
    Alert.alert('Remove link?', 'This link will be removed from story', [
      { text: 'Cancel' },
      { text: 'Remove', onPress: onDeleteHyperlink, style: 'destructive' },
    ]);
  }, [onDeleteHyperlink]);

  return (
    <Modal
      style={styles.bottomSheet}
      isOpen={isVisibleModal}
      onClosed={onClosed}
      position="bottom"
      swipeToClose
      swipeArea={250}
      backButtonClose
      coverScreen={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.commentBottomSheet}
      >
        <View style={styles.handleBar} />
        <View style={styles.titleContainer}>
          <View style={styles.flexContainer} />
          <View style={styles.flexContainer}>
            <Text style={styles.title}>Add link</Text>
          </View>
          <View style={styles.flexContainer}>
            <Text
              style={[
                styles.done,
                url &&
                  !urlErrorMessage &&
                  !customTextErrorMessage &&
                  styles.activeDone,
              ]}
              disabled={!url || !!urlErrorMessage || !!customTextErrorMessage}
              onPress={onSubmit}
            >
              {configDoneText}
            </Text>
          </View>
        </View>
        <View style={styles.horizontalSperator} />
        {loading && (
          <ActivityIndicator
            animating={loading}
            size="small"
            color={theme.colors.base}
          />
        )}
        <View
          style={[
            styles.inputContainer,
            url.length > 0 && urlErrorMessage && styles.alertBorderColor,
          ]}
        >
          <Text style={styles.label}>
            URL <Text style={styles.requiredSign}>*</Text>
          </Text>
          <TextInput
            defaultValue={url}
            onChangeText={handleUrl}
            style={styles.input}
            placeholder="https://www.example.com"
            placeholderTextColor={theme.colors.baseShade2}
            onFocus={validateHyperlinkText}
          />
        </View>
        {urlErrorMessage && (
          <Text style={styles.inValidUrl}>{urlErrorMessage}</Text>
        )}

        <View
          style={[
            styles.inputContainer,
            customizedText.length > 0 &&
              customTextErrorMessage &&
              styles.alertBorderColor,
          ]}
        >
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Customize Link Text</Text>
            <Text style={styles.textCount}>{customizedText.length}/30</Text>
          </View>
          <TextInput
            defaultValue={customizedText}
            onChangeText={handleCustomText}
            style={styles.input}
            placeholder="Name your link"
            placeholderTextColor={theme.colors.baseShade2}
            maxLength={30}
            onFocus={validateHyperlinkUrl}
          />
        </View>
        {customTextErrorMessage ? (
          <Text style={styles.inValidUrl}>{customTextErrorMessage}</Text>
        ) : (
          <Text style={styles.note}>
            This Text will show on the link instead of URL.
          </Text>
        )}
        {hyperlinkItem && (
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.deleteHyperlinkContainer}
              onPress={onPressDeleteHyperlink}
            >
              <SvgXml xml={storyDraftDeletHyperLink()} width="24" height="24" />
              <Text style={styles.removeLink}>Remove link</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default memo(HyperlinkConfig);
