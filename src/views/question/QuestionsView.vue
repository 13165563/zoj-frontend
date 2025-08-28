<template>
  <div class="questions-view">
    <h1>题目列表</h1>
    <a-card>
      <!-- 搜索表单 -->
      <a-form
        :model="searchForm"
        layout="inline"
        @submit="handleSearch"
      >
        <a-form-item field="title" label="题目标题">
          <a-input
            v-model="searchForm.title"
            placeholder="请输入题目标题"
            allow-clear
          />
        </a-form-item>
        
        <a-form-item field="tags" label="标签">
          <a-select
            v-model="searchForm.tags"
            :style="{ width: '300px' }"
            mode="multiple"
            placeholder="请选择标签"
            allow-clear
          >
            <a-option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</a-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">搜索</a-button>
          <a-button style="margin-left: 16px" @click="resetSearch">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 题目卡片列表 -->
    <div class="question-cards" style="margin-top: 20px">
      <a-row :gutter="20">
        <a-col
          v-for="question in questionList"
          :key="question.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="6"
          style="margin-bottom: 20px"
        >
          <a-card
            class="question-card"
            hoverable
            @click="viewQuestionDetail(question)"
          >
            <template #title>
              <div class="question-title">{{ question.title }}</div>
            </template>

            <template #extra>
              <a-tag color="arcoblue">{{ question.userVO?.userName || '未知用户' }}</a-tag>
            </template>

            <div class="question-info">
              <div class="question-tags">
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) in question.tags"
                    :key="index"
                    color="arcoblue"
                    size="small"
                  >
                    {{ tag }}
                  </a-tag>
                </a-space>
              </div>

              <div class="question-stats">
                <a-space size="medium">
                  <span>
                    <icon-thumb-up /> {{ question.thumbNum || 0 }}
                  </span>
                  <span>
                    <icon-star /> {{ question.favourNum || 0 }}
                  </span>
                  <span>
                    <icon-check-circle /> {{ question.acceptedNum || 0 }}/{{ question.submitNum || 0 }}
                    ({{ getAcceptanceRate(question) }})
                  </span>
                </a-space>
              </div>
              
              <div class="question-time">
                创建时间: {{ formatTime(question.createTime) }}
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- 分页 -->
      <a-pagination
        v-if="pagination.total > 0"
        :total="Number(pagination.total)"
        :current="pagination.current"
        :page-size="pagination.pageSize"
        :show-total="true"
        :show-jumper="true"
        :show-page-size="true"
        @change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        style="margin-top: 20px; justify-content: center; display: flex"
      />
    </div>

    <!-- 空状态 -->
    <a-empty v-if="!loading && questionList.length === 0" style="margin-top: 40px">
      <template #image>
        <icon-exclamation-circle-fill />
      </template>
      <div>暂无题目数据</div>
    </a-empty>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconExclamationCircleFill } from '@arco-design/web-vue/es/icon'
import { listQuestionVOByPage } from '@/api/question/questionApi'

// 使用路由
const router = useRouter()

// 搜索表单数据
const searchForm = reactive({
  title: '',
  tags: [] as string[]
})

// 所有标签列表
const allTags = ref<string[]>([])

// 题目列表
const questionList = ref<any[]>([])

// 加载状态
const loading = ref(false)

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 16,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true
})

// 查看题目详情
const viewQuestionDetail = (question: any) => {
  console.log('跳转到题目详情页，题目ID:', question.id)
  router.push(`/view/question/${question.id}`)
}

// 计算通过率
const getAcceptanceRate = (question: any) => {
  if (!question.submitNum || question.submitNum === 0) {
    return '0%'
  }
  const rate = (question.acceptedNum / question.submitNum) * 100
  return `${rate.toFixed(1)}%`
}

// 格式化时间
const formatTime = (time: string | Date | undefined) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString()
}

// 重置搜索
const resetSearch = () => {
  searchForm.title = ''
  searchForm.tags = []
  pagination.current = 1
  fetchQuestionList()
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1
  fetchQuestionList()
}

// 处理页码变化
const handlePageChange = (current: number) => {
  pagination.current = current
  fetchQuestionList()
}

// 处理页面大小变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  fetchQuestionList()
}

// 获取所有标签
const fetchAllTags = async () => {
  try {
    // 这里可以调用获取所有标签的API
    // 暂时使用静态数据或从题目列表中提取标签
    const tagsSet = new Set<string>()
    questionList.value.forEach(question => {
      if (question.tags && Array.isArray(question.tags)) {
        question.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    allTags.value = Array.from(tagsSet)
  } catch (err) {
    console.error('获取标签列表失败:', err)
  }
}

// 获取题目列表
const fetchQuestionList = async () => {
  loading.value = true
  try {
    const res = await listQuestionVOByPage({
      title: searchForm.title || undefined,
      tags: searchForm.tags.length > 0 ? searchForm.tags : undefined,
      current: pagination.current,
      pageSize: pagination.pageSize
    })

    console.log('获取题目列表响应:', res) // 调试信息

    if (res.code === 0) {
      // 处理题目数据中的标签
      questionList.value = res.data.records.map((question: any) => {
        // 处理标签 - 确保标签是数组格式
        if (typeof question.tags === 'string') {
          try {
            const parsedTags = JSON.parse(question.tags);
            if (Array.isArray(parsedTags)) {
              question.tags = parsedTags;
            } else {
              question.tags = [];
            }
          } catch (e) {
            question.tags = question.tags ? [question.tags] : [];
          }
        } else if (!Array.isArray(question.tags)) {
          question.tags = [];
        }
        
        // 确保必要的字段存在
        question.title = question.title || '';
        question.thumbNum = question.thumbNum || 0;
        question.favourNum = question.favourNum || 0;
        question.acceptedNum = question.acceptedNum || 0;
        question.submitNum = question.submitNum || 0;
        
        return question;
      });
      
      pagination.total = parseInt(res.data.total) || 0;
      // 获取所有标签
      fetchAllTags()
    } else {
      Message.error(res.message || '获取题目列表失败')
      console.error('获取题目列表失败:', res)
    }
  } catch (err: any) {
    Message.error('获取题目列表失败，请稍后重试')
    console.error('获取题目列表失败:', err)
    
    // 显示更详细的错误信息
    if (err.response) {
      console.error('错误响应:', err.response)
      Message.error(`服务器错误: ${err.response.status} ${err.response.statusText}`)
    } else if (err.request) {
      console.error('无响应:', err.request)
      Message.error('网络错误，请检查网络连接')
    } else {
      console.error('请求错误:', err.message)
    }
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchQuestionList()
})
</script>

<style scoped>
.questions-view {
  padding: 20px;
  background-color: #ffffff;
  color: #000000;
  border: none;
  min-height: calc(100vh - 64px);
}

.questions-view h1 {
  margin-bottom: 20px;
  text-align: center;
}

.question-card {
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.question-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-title {
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.question-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-tags {
  min-height: 24px;
}

.question-stats {
  margin-top: auto;
  font-size: 12px;
  color: #888;
}

.question-time {
  font-size: 12px;
  color: #888;
}
</style>