export type OrderHeaderProps = {
  kantinName: string;
  sellerName: string;
  orderId: string;
  estimation: string;
};

export type TimelineItemProps = {
  title: string;
  description: string;
};

export type OrderTimelineProps = {
  timeline: TimelineItemProps[];
};

export type ItemProps = {
  name: string;
  qty: number;
  price: string;
};

export type OrderItemsProps = {
  items: ItemProps[];
};