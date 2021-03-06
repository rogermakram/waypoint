import './style.css'
import '@hashicorp/nextjs-scripts/lib/nprogress/style.css'
import NProgress from '@hashicorp/nextjs-scripts/lib/nprogress'
import useAnchorLinkAnalytics from '@hashicorp/nextjs-scripts/lib/anchor-link-analytics'
import Router from 'next/router'
import HashiHead from '@hashicorp/react-head'
import HashiStackMenu from '@hashicorp/react-hashi-stack-menu'
import Head from 'next/head'
import AlertBanner from '@hashicorp/react-alert-banner'
import createConsentManager from '@hashicorp/nextjs-scripts/lib/consent-manager'
import { ErrorBoundary } from '@hashicorp/nextjs-scripts/lib/bugsnag'
import ProductSubnav from 'components/subnav'
import Footer from '../components/footer'
import Error from './_error'
import alertBannerData, { ALERT_BANNER_ACTIVE } from 'data/alert-banner'

NProgress({ Router })
const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

const title = 'Waypoint by HashiCorp'
const description =
  'Waypoint is an open source solution that provides a modern workflow for build, deploy, and release across platforms.'

function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <HashiHead
        is={Head}
        title={title}
        siteName={title}
        description={description}
        image="https://www.waypointproject.io/img/og-image.png"
        icon={[{ href: '/favicon.ico' }]}
      >
        <meta name="og:title" property="og:title" content={title} />
        <meta
          name="og:description"
          property="og:title"
          content={description}
        />
      </HashiHead>
      {ALERT_BANNER_ACTIVE && <AlertBanner {...alertBannerData} theme="blue" />}
      <HashiStackMenu />
      <ProductSubnav />
      <div className="content">
        <Component {...pageProps} />
      </div>
      <Footer openConsentManager={openConsentManager} />
      <ConsentManager />
    </ErrorBoundary>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  } else if (Component.isMDXComponent) {
    // fix for https://github.com/mdx-js/mdx/issues/382
    const mdxLayoutComponent = Component({}).props.originalType
    if (mdxLayoutComponent.getInitialProps) {
      pageProps = await mdxLayoutComponent.getInitialProps(ctx)
    }
  }

  return { pageProps }
}

export default App
