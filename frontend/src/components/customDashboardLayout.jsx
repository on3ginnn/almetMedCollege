// components/customDashboardLayout.jsx
import React from 'react';
import { DashboardLayout as BaseLayout } from '@toolpad/core/DashboardLayout';
import { MenuList, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';

export const CustomDashboardLayout = ({ navigation = [], router, children, ...props }) => {
  return (
    <BaseLayout
      {...props}
      renderNavigation={() => (
        <MenuList>
          {navigation.map((item, index) => {
            if (item.kind === 'header') {
              return (
                <React.Fragment key={index}>
                  <Divider sx={{ my: 1 }} />
                </React.Fragment>
              );
            }

            return item.external ? (
              <MenuItem
                key={item.title}
                component="a"
                href={item.segment}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </MenuItem>
            ) : (
              <MenuItem
                key={item.title}
                onClick={() => router.navigate(item.segment)} // ← используем полученный router
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </MenuItem>
            );
          })}
        </MenuList>
      )}
    >
      {children}
    </BaseLayout>
  );
};
