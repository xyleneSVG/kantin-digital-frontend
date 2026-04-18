export type OrderData = {
  id?: number; 
  kantin: string;
  status: string;
  statusBg: string;
  statusText: string;
  image: string;
  title: string;
  qty: number;
  price: string;
  date: string;
};

export type CardItemProps = {
  data: OrderData;
};

export type ActivityItem = {
  cardItem: CardItemProps;
};