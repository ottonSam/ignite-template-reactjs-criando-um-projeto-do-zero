import { GetServerSideProps, GetStaticProps } from 'next';

import Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

 export default function Home({postsPagination}: HomeProps) {
    console.log(postsPagination)
    return (
      <h1>opa</h1>
    )
 }

 export const getStaticProps: GetServerSideProps = async () => {
    const prismic = getPrismicClient();
    const postsResponse = await prismic.query([
      Prismic.Predicates.at('document.type', 'post')
    ], {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 20,
    });
    console.log(postsResponse);

    return {
      props: {postsResponse}
    };

 };
