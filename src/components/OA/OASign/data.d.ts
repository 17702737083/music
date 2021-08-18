export type SignRecordDTO = {
  referenceId?: string;
  callbackUrl?: string;
  step: number;
  stepName: string;
  signAsGroup?: string;
  signerEmployeeIdList: string[];
  signerEmployeeIdListString: string;
  signerEmployeeNameList: string[];
  signerEmployeeNameListString: string;
  signerEmployeeEnNameList?: string[];
  signerEmployeeEnNameListString?: string;
  signerEmployeeMailList?: string[];
  signerEmployeeMailListString?: string;
  actualSignEmployeeId?: string;
  actualSignStatus?: string;
  actualSignComment?: string;
  actualSignDateTime?: Date;
  inviteBy?: string;
  inviteDateTime?: Date;
  inviteComment?: string;
  required?: boolean;
  onlyOneSigner?: boolean;
};

export type OASignActionProps = {
  /**
   * action执行之前的校验.
   * 如果有设定,校验通过才会继续.
   * 请不要设定复杂逻辑影响签核速度.
   */
  validate?: (referenceId?: string) => Promise<boolean>;
  /**
   * action执行成功
   */
  success?: (signRecordDTOList?: SignRecordDTO[]) => Promise<void>;
  /**
   * action执行失败
   */
  fail?: (referenceId?: string, message?: string) => Promise<void>;
};

export type OASignInitialProps = {
  /**
   * 加载模式
   * preview:预览.不可签核
   * sign:签核页面.可签核
   */
  mode?: 'preview' | 'sign' | 'edit';
  /**
   * 关联id.目前暂时考量的是string.
   * 未来不排除支持默认id类型number/long
   */
  referenceId?: string;

  /**
   * 字典设定key.用于起单
   */
  dictKey?: string;
  /**
   * 是否自动产生关联id.格式为guid
   */
  autoGenerateRefenceId?: boolean;

  /**
   * 签核同意文本
   */
  approveButtonText?: string;
  /**
   * 签核驳回文本
   */
  rejectButtonText?: string;
  /**
   * 签核邀签文本
   */
  inviteButtonText?: string;

  /**
   * 签核意见
   */
  comment?: string;

  /**
   * 签核意见
   */
  commentPlaceHolder?: string;
  /**
   * 签核路径
   */
  callBackUrl?: string;
  /**
   * 大类
   */
  category?: string;
  /**
   * 小类
   */
  subCategory?: string;
  /**
   * 细项
   */
  item?: string;

  showApproveButton?: boolean;
  showRejectButton?: boolean;
  showInviteButton?: boolean;
  showCommentTextArea?: boolean;
};

export type OASignComponentProps = {
  /**
   * 初始化配置
   */
  initialValues?: OASignInitialProps;

  /**
   * 起单
   */
  onCreate?: OASignActionProps;

  /**
   * 查询
   */
  onQuery?: OASignActionProps;

  /**
   * 签核驳回
   */
  onReject?: OASignActionProps;
  /**
   * 签核同意成功
   */
  onApprove?: OASignActionProps;

  /**
   * 邀签
   */
  onInvite?: OASignActionProps;
};
