
import { AppstoreTwoTone, CarTwoTone, ContactsTwoTone, ContainerTwoTone, IdcardTwoTone, MessageTwoTone, MoneyCollectTwoTone, PrinterTwoTone, ProjectTwoTone, ReconciliationTwoTone, SafetyCertificateTwoTone, ScheduleTwoTone, SoundTwoTone, WarningTwoTone } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Row, Col, Card } from 'antd';
import styles from './index.less';

export default () => {


  return (
    <>
      <ProCard split="vertical" >
        <ProCard layout="center" className={styles.link}>
          <div>
            <MoneyCollectTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>採購請款</div>
          </div>
        </ProCard>
        <ProCard layout="center" className={styles.link}>
          <div>
            <ContactsTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>招募中心</div>
          </div>
        </ProCard>
        <ProCard layout="center" className={styles.link}>
          <div>
            <CarTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>車輛業務</div>
          </div>
        </ProCard>
        <ProCard layout="center" className={styles.link}>
          <div>
            <ContainerTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>電子合同</div>
          </div>
        </ProCard>

      </ProCard>
      <ProCard split="vertical" >
        <ProCard layout="center" className={styles.link}>
          <div>
            <IdcardTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>個人中心</div>
          </div>
        </ProCard>
        <ProCard layout="center" className={styles.link}>
          <div>
            <MessageTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>意見反饋</div>
          </div>
        </ProCard>
        <ProCard layout="center" className={styles.link}>
          <div>
            <ProjectTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>任務管理</div>
          </div>
        </ProCard>
        <ProCard layout="center" className={styles.link}>
          <div>
            <SoundTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>消息中心</div>
          </div>
        </ProCard>

      </ProCard>
      <ProCard split="vertical" >
        <ProCard layout="center" className={styles.link}>
          <div>
            <ScheduleTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>出差管理</div>
          </div>
        </ProCard>
        <ProCard layout="center" className={styles.link}>
          <div>
            <SafetyCertificateTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>安全中心</div>
          </div>
        </ProCard>
        <ProCard layout="center" className={styles.link}>
          <div>
            <PrinterTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>設備管理</div>
          </div>
        </ProCard>
        <ProCard layout="center" className={styles.link}>
          <div>
            <AppstoreTwoTone className={styles.linkIcon} />
            <div className={styles.linkText}>...</div>
          </div>
        </ProCard>

      </ProCard>
    </>)

}
