import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Avatar, Dropdown, Tag, message, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Link, Route, Redirect, Switch } from 'dva/router';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Debounce from 'lodash-decorators/debounce';
import HeaderSearch from '../components/HeaderSearch';
import NoticeIcon from '../components/NoticeIcon';
import GlobalFooter from '../components/GlobalFooter';
import NotFound from '../routes/Exception/404';
import styles from './BasicLayout.less';
import logo from '../assets/logo.png';
import LocalStorage from '../utils/storage';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项
    this.menus = props.navData.reduce((arr, current) => arr.concat(current.children), []);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }
  getChildContext() {
    const { location, navData, getRouteData } = this.props;
    const routeData = getRouteData('BasicLayout');
    const firstMenuData = navData.reduce((arr, current) => arr.concat(current.children), []);
    const menuData = this.getMenuData(firstMenuData, '');
    const breadcrumbNameMap = {};

    routeData.concat(menuData).forEach((item) => {
      breadcrumbNameMap[item.path] = item.name;
    });
    return { location, breadcrumbNameMap };
  }
  componentWillMount() {
    const OptCodes = LocalStorage.get('OptCodes') || [];
    this.newMenus = this.filterMenu(this.menus, OptCodes);
  }
  componentDidMount() {
    const currentUser = LocalStorage.get('currentUser');
    // console.log(currentUser);
    if (currentUser) { // 用户清除缓存，路由定向到登陆页面
      this.props.dispatch({
        type: 'login/saveCurrentUser',
        payload: currentUser,
      });
    }
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }
  getMenuData = (data, parentPath) => {
    let arr = [];
    data.forEach((item) => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name });
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`));
      }
    });
    return arr;
  }
  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard'];
    }
    return currentMenuSelectedKeys;
  }
  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props;
    const keys = pathname.split('/').slice(1);
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key];
    }
    return keys;
  }
  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name || item.hidden === true) {
        return null;
      }
      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : item.name
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon} />;
      // console.log('itemPath', itemPath);
      return (
        <Menu.Item key={item.key || item.path}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={itemPath} target={item.target}>
                {icon}<span>{item.name}</span>
              </a>
            ) : (
              <Link
                to={itemPath}
                target={item.target}
                replace={itemPath === this.props.location.pathname}
              >
                {icon}<span>{item.name}</span>
              </Link>
            )
          }
        </Menu.Item>
      );
    });
  }
  getPageTitle() {
    const { location, getRouteData } = this.props;
    const { pathname } = location;
    let title = '自动化运营平台';
    getRouteData('BasicLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - 自动化运营平台`;
      }
    });
    return title;
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }


  // 菜单层级嵌套递归，不仅限于两级菜单
  getMenuClildren = (childData, childrenArr) => {
    const OptCodes = LocalStorage.get('OptCodes') || [];
    const keyCorrect = (key) => {
      return !key || OptCodes.indexOf(key) !== -1;
    };
    let newChildren;
    childData.children.forEach((c) => { // 1级菜单
      const child = {
        name: c.name,
        optcode: c.optcode,
        path: c.path,
        hidden: c.hidden,
        component: c.component || '',
        children: c.children || [],
      };
      newChildren = JSON.parse(JSON.stringify(child)); // 对象深拷贝
      if (newChildren.children.length > 0 && keyCorrect(c.optcode)) {
        this.filterMenuChildren(newChildren, keyCorrect);
      } else if (!keyCorrect(c.optcode)) {
        return true;
      }
      childrenArr.push(newChildren);
    });
    return childrenArr;
  };

  // 递归遍历菜单（匹配key是否符合当前用户下所拥有的菜单code码）
  filterMenuChildren = (data, fun) => {
    let menuList;
    if (data.children.length > 0 && fun(data.optcode)) {
      const newArr = [];
      menuList = data.children.forEach((item, index) => {
        if (!fun(item.optcode)) {
          data.children = newArr;
          return true;
        }
        newArr.push(item);

        if (item.children) {
          this.filterMenuChildren(item, fun);
        }
      });
    }
    return menuList;
  }

  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.menus.some(
      item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  }
  toggle = () => {
    const { collapsed } = this.props;
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  // 左侧菜单根据个人权限显示
  filterMenu = (data, keys) => {
    const activeMenu = [];
    const keyCorrect = (key) => {
      return !key || keys.indexOf(key) !== -1;
    };
    data.forEach((menu) => {
      // 1. 如果没有该一级菜单的权限,直接返回.
      if (!keyCorrect(menu.optcode)) {
        return true;
      }

      // 2. 有一级菜单权限
      const m = Object.assign({}, menu);

      // 3. 如果没有子菜单,直接添加一级菜单返回.
      if (!menu.children) {
        activeMenu.push(m);
        return true;
      }

      // 4. 如果有子菜单,遍历子菜单权限.
      const children = [];
      this.getMenuClildren(menu, children);

      // 子菜单不为空, 则加入主菜单
      if (children.length > 0) {
        Object.assign(m, { children });
        activeMenu.push(m);
      }
    });
    return activeMenu;
  }
  render() {
    const { currentUser, collapsed, fetchingNotices, getRouteData } = this.props;
    // console.log('menus', this.newMenus);
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();

    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys,
    };

    const layout = (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={this.onCollapse}
          width={270}
          className={styles.sider}
        >
          <div className={styles.logo}>
            <Link to="/">
              <img src={logo} alt="logo" />
              <h1>自动化运营平台</h1>
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={this.getCurrentMenuSelectedKeys()}
            style={{ margin: '16px 0', width: '100%' }}
          >
            {this.getNavMenuItems(this.newMenus)}
          </Menu>
        </Sider>
        <Layout>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className={styles.right}>
              {/* <HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="站内搜索"
                dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                onSearch={(value) => {
                  console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={(value) => {
                  console.log('enter', value); // eslint-disable-line
                }}
              /> */}

              {currentUser.user_name ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} src={currentUser.profile_photo} />
                    {currentUser.user_name}
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={{ marginLeft: 8 }} />}
            </div>
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {
                  getRouteData('BasicLayout').map(item =>
                    (
                      <Route
                        exact={item.exact}
                        key={item.path}
                        path={item.path}
                        component={item.component}
                      />
                    )
                  )
                }
                <Redirect exact from="/" to="/user/login" />
                <Redirect exact from="/resource-center" to="/resource-center/public-cloud/cloud-manage" />
                <Redirect exact from="/resource-center/public-cloud" to="/resource-center/public-cloud/cloud-manage" />
                <Redirect exact from="/resource-center/envtype-manage" to="/resource-center/envtype-manage/env-type" />
                <Redirect exact from="/resource-center/business-manage" to="/resource-center/business-manage/project-list" />
                <Redirect exact from="/resource-center/k8s-manage" to="/resource-center/k8s-manage/sourceobj-manage" />
                <Redirect exact from="/release-manage" to="/release-manage/pro-release" />
                <Redirect exact from="/user-manage" to="/user-manage/userlist" />
                <Redirect exact from="/cmdb" to="/cmdb/equipment-manage/service-manage/physical-manage/all-physical" />
                <Redirect exact from="/cmdb/equipment-manage" to="/cmdb/equipment-manage/service-manage/physical-manage/all-physical" />
                <Redirect exact from="/cmdb/equipment-manage/service-manage" to="/cmdb/equipment-manage/service-manage/physical-manage/all-physical" />
                <Redirect exact from="/cmdb/equipment-manage/service-manage/physical-manage" to="/cmdb/equipment-manage/service-manage/physical-manage/all-physical" />
                <Redirect exact from="/cmdb/equipment-manage/service-manage/virtual-manage" to="/cmdb/equipment-manage/service-manage/virtual-manage/all-virtual" />
                <Route component={NotFound} />
              </Switch>
            </div>
            <GlobalFooter />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  currentUser: state.login.currentUser,
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
}))(BasicLayout);
