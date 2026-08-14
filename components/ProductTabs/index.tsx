'use client';

import { useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import type { Product } from '@/lib/shop/types';
import styles from './ProductTabs.module.css';

type Tab = { id: string; label: string; products: Product[] };

export default function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '');
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="상품 분류">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={tab.id === active?.id}
            aria-controls={`panel-${tab.id}`}
            className={`${styles.tab} ${tab.id === active?.id ? styles.tabActive : ''}`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active && (
        <div role="tabpanel" id={`panel-${active.id}`} aria-labelledby={`tab-${active.id}`}>
          <ProductGrid products={active.products} />
        </div>
      )}
    </div>
  );
}
