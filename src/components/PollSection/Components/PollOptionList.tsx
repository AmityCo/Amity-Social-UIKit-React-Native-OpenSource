import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { useStyles } from '../style';

import PollBar from './PollBar';
import RadioOnIcon from '../../../svg/RadioOnIcon';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../../providers/amity-ui-kit-provider';
import RadioOffIcon from '../../../svg/RadioOffIcon';

interface IPollOptionList {
  options: Amity.PollAnswer[];
  answerType: Amity.PollAnswerType;
  isAlreadyVoted: boolean;
  isPollClosed: boolean;
  totalVote: number;
  onSubmit: (selectedOption: string[]) => void;
}

const PollOptionList: FC<IPollOptionList> = ({
  options: data = [],
  answerType,
  isAlreadyVoted,
  isPollClosed,
  totalVote,
  onSubmit,
}) => {

  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const [options, setOptions] = useState(data.slice(0, 2) || []);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const hiddenOptions = data?.length - [...options]?.length || 0;
  const showedAllOptions = hiddenOptions === 0;
  const isSingleOption = answerType === 'single';

  useEffect(() => {
    setOptions(data.slice(0, 2));
  }, [data]);

  const onPressMoreOption = useCallback(() => {
    setOptions([...data]);
  }, [data]);

  const onPressOption = useCallback(
    (optionId: string) => {
      if (isSingleOption) return setSelectedOption([optionId]);
      const currentSelectedOptions = [...selectedOption];
      const index = currentSelectedOptions.findIndex((id) => id === optionId);
      if (index !== -1) {
        currentSelectedOptions.splice(index, 1);
      } else {
        currentSelectedOptions.push(optionId);
      }
      setSelectedOption([...currentSelectedOptions]);
    },
    [isSingleOption, selectedOption]
  );

  const renderSubmitButton = useMemo(() => {
    if (isPollClosed || isAlreadyVoted) return null;
    return (
      <TouchableOpacity
        onPress={() => onSubmit(selectedOption)}
        style={styles.submitBtn}
      >
        <Text style={styles.submit}>Submit</Text>
      </TouchableOpacity>
    );
  }, [isPollClosed, isAlreadyVoted, styles, onSubmit, selectedOption]);

  const renderViewAllOptions = useMemo(() => {
    const resultText =
      isPollClosed || isAlreadyVoted
        ? `View full results`
        : `${hiddenOptions} more options`;
    return (
      <TouchableOpacity
        onPress={onPressMoreOption}
        style={styles.moreOptionsBtn}
      >
        <Text>{resultText}</Text>
      </TouchableOpacity>
    );
  }, [
    hiddenOptions,
    isPollClosed,
    isAlreadyVoted,
    onPressMoreOption,
    styles.moreOptionsBtn,
  ]);

  return (
    <>
      {options.map((option) => {
        const selectedItem = selectedOption.includes(option.id);
        const selectedOptionContainerStyle: ViewStyle =
          selectedItem && styles.selectedOptionContainer;
        const lengthPercentage = (option.voteCount / totalVote) * 100;
        const length = isNaN(lengthPercentage) ? 0 : lengthPercentage;
        const onResultOptionStyle: ViewStyle =
          (isAlreadyVoted || isPollClosed) &&
          option.isVotedByUser &&
          styles.onResultOption;
        return (
          <TouchableOpacity
            disabled={isPollClosed || isAlreadyVoted}
            key={`${option.id}${option.isVotedByUser}`}
            style={[
              styles.pollOptionContainer,
              selectedOptionContainerStyle,
              onResultOptionStyle,
            ]}
            onPress={() => onPressOption(option.id)}
          >
            <View style={styles.pollOptionContainerRow}>
              {!isPollClosed && !isAlreadyVoted && (
                selectedItem ? <RadioOnIcon width={20} height={20} color={theme.colors.primary} /> : <RadioOffIcon width={20} height={20} />
              )}
              <Text style={styles.optionText}>{option.data}</Text>
            </View>
            {(isPollClosed || isAlreadyVoted) && (
              <>
                <PollBar myVote={option.isVotedByUser} length={length} />
                <Text style={styles.voteCount}>{option.voteCount} votes</Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
      {showedAllOptions ? renderSubmitButton : renderViewAllOptions}
    </>
  );
};

export default memo(PollOptionList);
