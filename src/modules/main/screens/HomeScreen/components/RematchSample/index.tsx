import React from 'react';
import { Card, CardItem, Text, View, Button } from '@app/components';
import { SharksState, DolphinsState } from '@app/store';
import { styles } from './styles';

interface Props {
  sharks: SharksState;
  dolphins: DolphinsState;
  incrementShark: () => void;
  incrementSharkAsync: () => void;
  incrementDolphin: () => void;
  incrementDolphinAsync: () => void;
}

export const RematchSample = ({
  sharks,
  dolphins,
  incrementDolphin,
  incrementDolphinAsync,
  incrementShark,
  incrementSharkAsync,
}: Props): JSX.Element => (
  <>
    <Card>
      <CardItem header bordered>
        <Text primary>Rematch with redux-persist</Text>
      </CardItem>
      <CardItem bordered>
        <View column>
          <Text>Sharks: {sharks.count}</Text>
          <Button onPress={incrementShark} style={styles.button}>
            <Text>Raise shark</Text>
          </Button>
          <Button onPress={incrementSharkAsync} style={styles.button}>
            <Text>Raise shark async</Text>
          </Button>
        </View>
      </CardItem>
    </Card>
    <Card>
      <CardItem header bordered>
        <Text primary>Rematch without redux-persist</Text>
      </CardItem>
      <CardItem bordered>
        <View column>
          <Text>Dolphins: {dolphins.count}</Text>
          <Button onPress={incrementDolphin} style={styles.button}>
            <Text>Raise dolphin</Text>
          </Button>
          <Button onPress={incrementDolphinAsync} style={styles.button}>
            <Text>Raise dolphin async</Text>
          </Button>
        </View>
      </CardItem>
    </Card>
  </>
);
