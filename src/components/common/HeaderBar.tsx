// src/components/common/HeaderBar.tsx
export const HeaderBar = () => {
  return (
    <header className="header">
      <div className="logo">Cooking</div>
      <div className="header-controls">
        <button className="location-pill" type="button">
          <span aria-hidden="true">📍</span>
          <span>Central, Hong Kong</span>
        </button>
        <div className="search-bar">
          <input type="search" placeholder="Search meals, stores, or cuisines" />
        </div>
        <button className="profile-chip" type="button" aria-label="View profile">
          F
        </button>
      </div>
    </header>
  );
};
