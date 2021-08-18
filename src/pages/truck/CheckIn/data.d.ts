

export type ExtraData = {
  gateId: string;
  inOrOut: string;
  handCarry: string;
}




export  type TruckPlanInfo = {
  id: number;
  item: string;
  company: string;
  plant: string;
  deliveryDate: string;
  forwarder: string;
  truckNo: string;
  driver: string;
  driverId: string;
  reference: string;
  deliveryTime: Date;
  logId: string;
  logDate: string;
  actualDeliveryTime: Date;
  guardId: string;
  extension: string;
  leaveTime: Date;
  lGuardId: string;
  exception: string;
  notes: string;
  acpDate: string;
  checkin: string;
  checkout: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
