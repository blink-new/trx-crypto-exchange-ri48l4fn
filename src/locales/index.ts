import ru_common from './ru/common.json';
import ru_markets from './ru/markets.json';
import ru_trading from './ru/trading.json';
import ru_dashboard from './ru/dashboard.json';
import ru_earn from './ru/earn.json';
import ru_vip from './ru/vip.json';
import ru_research from './ru/research.json';
import ru_support from './ru/support.json';
import ru_sidemenu from './ru/sidemenu.json';
import ru_home from './ru/home.json';
import ru_chart from './ru/chart.json';
import ru_profile from './ru/profile.json';
import ru_legal from './ru/legal.json';
import ru_deposit from './ru/deposit.json';
import ru_withdraw from './ru/withdraw.json';
import ru_insuranceFund from './ru/insuranceFund.json';
import ru_assets from './ru/assets.json';
import ru_orders from './ru/orders.json';
import ru_pairsList from './ru/pairsList.json';
import ru_settings from './ru/settings.json';
import ru_security from './ru/security.json';
import ru_launchpad from './ru/launchpad.json';
import ru_news from './ru/news.json';
import ru_blog from './ru/blog.json';

import en_common from './en/common.json';
import en_markets from './en/markets.json';
import en_trading from './en/trading.json';
import en_dashboard from './en/dashboard.json';
import en_earn from './en/earn.json';
import en_vip from './en/vip.json';
import en_research from './en/research.json';
import en_support from './en/support.json';
import en_sidemenu from './en/sidemenu.json';
import en_home from './en/home.json';
import en_chart from './en/chart.json';
import en_profile from './en/profile.json';
import en_legal from './en/legal.json';
import en_deposit from './en/deposit.json';
import en_withdraw from './en/withdraw.json';
import en_insuranceFund from './en/insuranceFund.json';
import en_assets from './en/assets.json';
import en_orders from './en/orders.json';
import en_pairsList from './en/pairsList.json';
import en_settings from './en/settings.json';
import en_security from './en/security.json';
import en_launchpad from './en/launchpad.json';
import en_news from './en/news.json';
import en_blog from './en/blog.json';

export const translations = {
  ru: {
    common: ru_common,
    markets: ru_markets,
    trading: ru_trading,
    dashboard: ru_dashboard,
    earn: ru_earn,
    vip: ru_vip,
    research: ru_research,
    support: ru_support,
    sidemenu: ru_sidemenu,
    home: ru_home,
    chart: ru_chart,
    profile: ru_profile,
    legal: ru_legal,
    deposit: ru_deposit,
    withdraw: ru_withdraw,
    insuranceFund: ru_insuranceFund,
    assets: ru_assets,
    orders: ru_orders,
    pairsList: ru_pairsList,
    settings: ru_settings,
    security: ru_security,
    launchpad: ru_launchpad,
    news: ru_news,
    blog: ru_blog
  },
  en: {
    common: en_common,
    markets: en_markets,
    trading: en_trading,
    dashboard: en_dashboard,
    earn: en_earn,
    vip: en_vip,
    research: en_research,
    support: en_support,
    sidemenu: en_sidemenu,
    home: en_home,
    chart: en_chart,
    profile: en_profile,
    legal: en_legal,
    deposit: en_deposit,
    withdraw: en_withdraw,
    insuranceFund: en_insuranceFund,
    assets: en_assets,
    orders: en_orders,
    pairsList: en_pairsList,
    settings: en_settings,
    security: en_security,
    launchpad: en_launchpad,
    news: en_news,
    blog: en_blog
  }
};

type Language = 'ru' | 'en';
type TranslationKey = keyof typeof translations.ru;