export type TruckPlanUploadInfo = {
  driverId: string;
  truckNo: string;
  truckPlanType: string;
  company: string;
  plant: string;
  deliveryDate: string;
  deliveryTime: string;
  driver: string;
  forwarder: string;
  reference: string;
  actualDeliveryTime: string;
  guardId: string;
  leaveTime: string;
  leaveGuardId: string;
};

export type TruckPlanUploadParams = {
  driverId?: string;
  truckNo?: string;
  truckPlanType?: string;
  company?: string;
  plant?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  driver?: string;
  forwarder?: string;
  reference?: string;
  actualDeliveryTime?: string;
  guardId?: string;
  leaveTime?: string;
  leaveGuardId?: string;
};
