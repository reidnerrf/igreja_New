import React from 'react';
import { FlatList, FlatListProps, View } from 'react-native';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

type SmartListProps<T> = FlatListProps<T> & {
  isLoading?: boolean;
  estimatedItemHeight?: number;
  emptyTitle?: string;
  emptySubtitle?: string;
};

export function SmartList<T>(props: SmartListProps<T>) {
  const {
    isLoading,
    data,
    estimatedItemHeight = 72,
    emptyTitle = 'Nada por aqui',
    emptySubtitle = 'Volte mais tarde ou ajuste seus filtros.',
    ListEmptyComponent,
    ListFooterComponent,
    keyExtractor,
    ...rest
  } = props as any;

  const effectiveKeyExtractor = keyExtractor || ((item: any, index: number) => item?.id || item?._id || String(index));

  const loadingFooter = (
    <View style={{ padding: 16 }}>
      <Skeleton height={estimatedItemHeight - 24} style={{ marginBottom: 12 }} />
      <Skeleton height={estimatedItemHeight - 24} style={{ marginBottom: 12 }} />
      <Skeleton height={estimatedItemHeight - 24} />
    </View>
  );

  const emptyComp = (
    <EmptyState icon="folder-open" title={emptyTitle} subtitle={emptySubtitle} />
  );

  return (
    <FlatList
      keyExtractor={effectiveKeyExtractor}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={8}
      removeClippedSubviews
      getItemLayout={(_, index) => ({ length: estimatedItemHeight, offset: estimatedItemHeight * index, index })}
      ListEmptyComponent={data && data.length === 0 ? (ListEmptyComponent || emptyComp) : undefined}
      ListFooterComponent={isLoading ? (ListFooterComponent || loadingFooter) : ListFooterComponent}
      {...rest}
    />
  );
}

