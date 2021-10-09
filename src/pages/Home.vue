<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md items-end q-col-gutter-md row">
        <div class="col">
          <q-input
            bottom-slots
            v-model="newQweetContent"
            placeholder="What's up?"
            counter
            maxlength="280"
            autogrow
            class="new-qweet"
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg">
              </q-avatar>
            </template>

            <template v-slot:append>
              <q-icon v-if="newQweetContent !== ''" name="close" @click="newQweetContent = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewQweet"
            :disable="!newQweetContent"
            unelevated
            class="q-mb-lg"
            rounded
            color="primary"
            label="Qweet"
            no-caps
          />
        </div>
      </div>
      <q-separator
        class="separator"
        size="10px"
        color="grey-2"
      />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeInDown slow"
          leave-active-class="animated fadeOutRight slow"
        >
          <q-item
            class="q-py-md"
            v-for="qweet in qweets"
            :key="qweet.id"
          >
            <q-item-section avatar top>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar2.jpg">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>User Name</strong>
                <span class="text-grey-7">
                  @user_name
                  <br class="lt-md">&bull; {{ distanceDate(qweet.date) }}
                </span>
              </q-item-label>
              <q-item-label class="qweet-content text-body1">
                {{ qweet.content }}
              </q-item-label>
              <div class="row justify-between q-mt-sm qweet-icons">
                <q-btn
                  round
                  flat
                  color="grey"
                  size="sm"
                  icon="far fa-comment"
                />
                <q-btn
                  round
                  flat
                  color="grey"
                  size="sm"
                  icon="fas fa-retweet"
                />
                <q-btn
                  round
                  flat
                  @click="toggleLike(qweet)"
                  size="sm"
                  :color="qweet.liked ? 'pink' : 'grey'"
                  :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                />
                <q-btn
                  @click="deleteQweet(qweet)"
                  round
                  flat
                  color="grey"
                  size="sm"
                  icon="fas fa-trash"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'
import { collection, doc, updateDoc, deleteDoc, addDoc, query, orderBy, onSnapshot } from "firebase/firestore"


export default {
  name: 'Home',
  data() {
    return {
      newQweetContent: '',
      qweets: []
    }
  },
  methods: {
    addNewQweet() {
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false
      }
      const docRef = addDoc(collection(db, "qweets"), newQweet)
      this.newQweetContent = ''
    },
    deleteQweet(qweet) {
      deleteDoc(doc(db, 'qweets', qweet.id))
    },
    toggleLike(qweet) {
      updateDoc(doc(db, "qweets", qweet.id), {
        liked: !qweet.liked
      })
    },
    distanceDate(date) {
      return formatDistance(date, Date.now(), {
        addSuffix: true,
        includeSeconds: true
      })
    }
  },
  mounted() {
    const q = query(collection(db, "qweets"), orderBy("date"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let qweetChange = change.doc.data()
        qweetChange.id = change.doc.id
        if (change.type === "added") {
          this.qweets.unshift(qweetChange)
        }
        if (change.type === "modified") {
          let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
          Object.assign(this.qweets[index], qweetChange)
        }
        if (change.type === "removed") {
          let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
          this.qweets.splice(index, 1)
        }
      })
    })

  }
}
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 18px
    line-height: 1.5 !important
.separator
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left: -5px
</style>
