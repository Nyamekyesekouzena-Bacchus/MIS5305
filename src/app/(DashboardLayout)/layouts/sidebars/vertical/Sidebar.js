import React from "react";
import { Button, Nav, NavItem } from "reactstrap";
import Logo from "../../shared/logo/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Each item lists the roles that can use it. Items without `roles` are shown to
// everyone. Field staff never see the admin-only management pages, and only
// management (Admin/Manager) see Reports.
const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: "bi bi-people",
    roles: ["Admin", "Manager"],
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: "bi bi-person-vcard",
    roles: ["Admin", "Manager"],
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: "bi bi-tools",
    roles: ["Admin", "Manager"],
  },
  {
    title: "Requests",
    href: "/admin/requests",
    icon: "bi bi-clipboard-check",
    roles: ["Admin", "Manager"],
  },
  {
    title: "Inspections",
    href: "/inspections",
    icon: "bi bi-search",
    roles: ["Field Worker"],
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: "bi bi-calendar-check",
    roles: ["Field Worker"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: "bi bi-bar-chart",
    roles: ["Manager"],
  },
];

const Sidebar = ({ role, showMobilemenu }) => {
  const location = usePathname();
  const visible = navigation.filter(
    (navi) => !navi.roles || navi.roles.includes(role)
  );

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <span className="ms-auto d-lg-none">
        <Button
          close
          size="sm"
          onClick={showMobilemenu}
          aria-label="Close navigation menu"
        ></Button>
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav" tag="nav" aria-label="Main navigation">
          {visible.map((navi, index) => (
            <NavItem  key={index} className="sidenav-bg">
              <Link 
                  href={navi.href}
                  aria-current={location === navi.href ? "page" : undefined}
                  className={
                    location === navi.href
                      ? "text-primary nav-link py-3"
                      : "nav-link text-secondary py-3"
                  }
                >
                  <i className={navi.icon} aria-hidden="true"></i>
                  <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
