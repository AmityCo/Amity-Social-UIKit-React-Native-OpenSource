import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { useStyles } from '../style';
import { SvgXml } from 'react-native-svg';
import { radioOff, radioOn } from '../../../svg/svg-xml-list';
import PollBar from './PollBar';

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
        disabled={selectedOption.length === 0}
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
        const selectedIcon = selectedItem ? radioOn() : radioOff();
        const selectedOptionContainerStyle: ViewStyle =
          selectedItem && styles.selectedOptionContainer;
        const selectedVoteCountStyle: TextStyle =
          (isAlreadyVoted || isPollClosed) &&
          option.isVotedByUser &&
          styles.selectedVoteCount;
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
                <SvgXml xml={selectedIcon} width="20" height="20" />
              )}
              <Text style={styles.optionText}>{option.data}</Text>
            </View>
            {(isPollClosed || isAlreadyVoted) && (
              <>
                <PollBar myVote={option.isVotedByUser} length={length} />
                <Text style={[styles.voteCount, selectedVoteCountStyle]}>
                  {option.voteCount} votes
                </Text>
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
