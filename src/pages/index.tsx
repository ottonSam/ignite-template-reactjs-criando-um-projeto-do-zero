import { GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { parseJSON } from 'date-fns';

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

 export default function Home(props: HomeProps) {
    console.log(props.postsPagination.results);
    return (
      <>
        {props.postsPagination.results.map(post => (
          <div key={post.uid}>
            <h1>{post.data.title}</h1>
            <h2>{post.data.subtitle}</h2>
            <div>
              <span>{post.data.author}</span>
              <time>{post.first_publication_date}</time>
            </div>
            
          </div>
        ))}
      </>
    )
 }

 export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();
    const postsResponse = await prismic.query([
      Prismic.Predicates.at('document.type', 'post')
    ], {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 20,
    });

    const posts = postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'short', 
          year: 'numeric'
        }).replace('de', '').replace('.', '').replace('de', ''),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        }
      }
    });

    return {
      props: {
        postsPagination: {
          next_page: postsResponse.next_page,
          results: posts
        }
      }
    }
  }
;
