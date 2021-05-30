import React from 'react'
import CIcon from '@coreui/icons-react'

/**
 * Nơi custom lại navbar cho web
 */
const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Thống kê',
    to: '/statistical',
    icon: <CIcon name="cil-monitor" customClasses="c-sidebar-nav-icon"/>,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Danh mục']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý kho',
    to: '/warehouse',
    icon: 'cil-door',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Quản lý sản phẩm',
        to: '/warehouse/products',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Quản lý nhập hàng',
        to: '/warehouse/import',
      }
    ]
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý đơn hàng',
    route: '/orders',
    icon: 'cil-library',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Đang xử lý',
        to: '/orders/process',
        badge: {
          color: 'success',
          text: 'NEW',
        },
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Đơn hàng hoàn thành',
        to: '/orders/complete',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý nhân sự',
    to: '/employees',
    icon: 'cil-group',
    _children:[
      {
        _tag: 'CSidebarNavItem',
        name: 'Quyền hệ thống',
        to: '/employees/permission',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Nhân viên',
        to: '/employees/account',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Nhân viên giao hàng',
        to: '/shippers',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tính công',
        to: '/salary',
      },
    ]
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản lý tài khoản']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Tài khoản',
    to: '/account',
    icon: 'cil-contact',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Thiết lập']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Cài đặt',
    to: '/setting',
    icon: 'cil-settings',
  },
  
]

export default _nav
