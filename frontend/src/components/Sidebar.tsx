import { useState } from "react";
import { motion } from "framer-motion";
import "./Sidebar.css"

type Filter =
  | "dashboard"
  | "search"
  | "all"
  | "bucket_list"
  | "playing"
  | "completed"
  | "dropped"
  | "upcoming";

interface SidebarProps {
  activeFilter: Filter;
  setActiveFilter: (filter: Filter) => void;
  getCount: (filter: Filter) => number;
  totalGames: number;
}

function Sidebar({
  activeFilter,
  setActiveFilter,
  getCount,
  totalGames,
}: SidebarProps) {
  // Hovered sidebar item
  const [hoveredItem, setHoveredItem] = useState<Filter | null>(null);

  const navItems = [
    {
      filter: "dashboard" as Filter,
      icon: "🏠",
      label: "Dashboard",
      count: true,
    },
    {
      filter: "search" as Filter,
      icon: "🔍",
      label: "Search",
      count: false,
    },
    {
      filter: "all" as Filter,
      icon: "🎮",
      label: "My Games",
      count: true,
    },
    {
      filter: "bucket_list" as Filter,
      icon: "📋",
      label: "Bucket List",
      count: true,
    },
    {
      filter: "playing" as Filter,
      icon: "▶",
      label: "Playing",
      count: true,
    },
    {
      filter: "completed" as Filter,
      icon: "✓",
      label: "Completed",
      count: true,
    },
    {
      filter: "dropped" as Filter,
      icon: "✕",
      label: "Dropped",
      count: true,
    },
    {
      filter: "upcoming" as Filter,
      icon: "📅",
      label: "Upcoming",
      count: true,
    },
  ];

  return (
    <aside className="sidebar">
      {/* =========================
          LOGO
      ========================= */}

      <motion.div
        className="sidebar-logo"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <motion.span
          whileHover={{
            scale: 1.2,
            rotate: -8,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 12,
          }}
        >
          🎮
        </motion.span>

        <span>My Journey</span>
      </motion.div>

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = activeFilter === item.filter;
          const isHovered = hoveredItem === item.filter;

          return (
            <motion.button
              key={item.filter}
              className={isActive ? "nav-item active" : "nav-item"}
              onClick={() => setActiveFilter(item.filter)}
              onMouseEnter={() => {
                setHoveredItem(item.filter);
              }}
              onMouseLeave={() => {
                setHoveredItem(null);
              }}
              whileHover={{
                x: 4,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              {/* =========================
                  ACTIVE BACKGROUND
              ========================= */}

              {isActive && (
                <motion.div
                  className="nav-active-bg"
                  layoutId="sidebar-active"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}

              {/* =========================
                  ICON
              ========================= */}

              <motion.span
                className="nav-icon"
                animate={{
                  scale: isHovered ? 1.15 : 1,
                  rotate: isHovered ? -5 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
              >
                {item.icon}
              </motion.span>

              {/* =========================
                  LABEL
              ========================= */}

              <span
                className={`nav-label ${isHovered ? "nav-label-hover" : ""}`}
              >
                {item.label}
              </span>

              {/* =========================
                  COUNT
              ========================= */}

              {item.count && (
                <motion.span
                  className="nav-count"
                  key={getCount(item.filter)}
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                >
                  {getCount(item.filter)}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* =========================
          BOTTOM
      ========================= */}

      <motion.div
        className="sidebar-bottom"
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.25,
        }}
      >
        <div className="sidebar-stat">
          <span>Total Games</span>

          <motion.strong
            key={totalGames}
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
          >
            {totalGames}
          </motion.strong>
        </div>
      </motion.div>
    </aside>
  );
}

export default Sidebar;
