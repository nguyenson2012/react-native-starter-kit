import React from 'react';
import { ActivityIndicator } from 'react-native';
import { colors } from '@app/core';

interface Props {
  size?: 'large' | 'small';
}

export const Loading = ({ size }: Props) => {
  return <ActivityIndicator size={size || 'large'} color={colors.primary} />;
};
